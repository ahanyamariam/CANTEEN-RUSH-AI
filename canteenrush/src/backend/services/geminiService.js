const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    });

    // Rate limiting state
    this.requestCount = 0;
    this.minuteStart = Date.now();
    this.MAX_REQUESTS_PER_MINUTE = 10;  // Free tier: 15/min, keep buffer
    this.retryAfter = 0;                // Timestamp when we can retry
    this.consecutiveFailures = 0;
    this.MAX_CONSECUTIVE_FAILURES = 3;
  }

  /**
   * Check if we should even attempt a Gemini call
   */
  _canMakeRequest() {
    const now = Date.now();

    // If we're in a cooldown period from a 429 error
    if (now < this.retryAfter) {
      const waitSec = Math.ceil((this.retryAfter - now) / 1000);
      console.log(`⏳ Gemini cooldown: ${waitSec}s remaining`);
      return false;
    }

    // If too many consecutive failures, back off
    if (this.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES) {
      // Back off for 2 minutes after repeated failures
      if (!this.backoffUntil || now > this.backoffUntil) {
        this.consecutiveFailures = 0; // Reset and try again
        this.backoffUntil = null;
      } else {
        console.log(`⏳ Gemini backoff: too many failures`);
        return false;
      }
    }

    // Per-minute rate limiting
    if (now - this.minuteStart > 60000) {
      this.requestCount = 0;
      this.minuteStart = now;
    }

    if (this.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
      console.log(`⏳ Gemini rate limit: ${this.requestCount}/${this.MAX_REQUESTS_PER_MINUTE} per minute`);
      return false;
    }

    return true;
  }

  /**
   * Handle API errors and set appropriate cooldowns
   */
  _handleError(error) {
    this.consecutiveFailures++;

    if (error.message?.includes('429') || error.message?.includes('quota')) {
      // Extract retry delay from error if available
      const retryMatch = error.message.match(/retry in (\d+)/i);
      const retrySec = retryMatch ? parseInt(retryMatch[1]) : 60;
      this.retryAfter = Date.now() + (retrySec * 1000);
      console.warn(`🔴 Gemini 429: Rate limited. Retry after ${retrySec}s`);
    } else if (error.message?.includes('403')) {
      // API key issue — long backoff
      this.retryAfter = Date.now() + (5 * 60 * 1000); // 5 minutes
      console.warn(`🔴 Gemini 403: Auth issue. Backing off 5 min`);
    } else {
      // Other errors — short backoff
      this.backoffUntil = Date.now() + (2 * 60 * 1000); // 2 minutes
      console.warn(`🔴 Gemini error: ${error.message}`);
    }
  }

  /**
   * Safe wrapper for Gemini calls with retry
   */
  async _safeGenerate(prompt, config = {}) {
    if (!this._canMakeRequest()) {
      return null; // Caller uses deterministic fallback
    }

    this.requestCount++;

    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          maxOutputTokens: 512,
          responseMimeType: 'application/json',
          ...config,
        },
      });

      // Success — reset failure counter
      this.consecutiveFailures = 0;

      const text = result.response.text();
      return JSON.parse(text);
    } catch (error) {
      this._handleError(error);
      return null;
    }
  }

  /**
   * Predict order preparation time
   */
  async predictPrepTime(ctx) {
    const prompt = `You are a food preparation time prediction engine for a campus canteen.
Predict EXACTLY how many minutes until this order is ready.

ORDER:
- Items: ${JSON.stringify(ctx.items)}
- Total items: ${ctx.totalItemCount}
- Complexities: ${JSON.stringify(ctx.itemComplexities)}
- Base prep times (min): ${JSON.stringify(ctx.basePrepTimes)}

VENDOR STATE:
- Shop: "${ctx.vendorName}"
- Active orders now: ${ctx.activeOrders}
- Queue ahead: ${ctx.queueDepth}
- Max concurrent: ${ctx.maxConcurrent}
- Vendor avg prep: ${ctx.vendorAvgPrepTime} min

TIME:
- Now: ${ctx.currentTime}
- Day: ${ctx.dayOfWeek}
- Rush hour (11-13): ${ctx.isRushHour}

HISTORY:
- Avg prediction error: ${ctx.avgPredictionError} min
- Rush multiplier: ${ctx.rushMultiplier}x
- Trend: ${ctx.recentTrend}
- Recent orders: ${JSON.stringify(ctx.recentCompletedOrders)}

RULES:
1. Queue position matters — orders ahead finish first (unless parallelized)
2. Complex items take longer; simple items can batch
3. Rush hour → multiply by rush multiplier
4. At max capacity → add wait time
5. Be slightly conservative
6. Bounds: 2-45 minutes

Respond ONLY in JSON:
{
  "estimated_prep_minutes": <number>,
  "confidence": <0 to 1>,
  "reasoning": "<1-2 sentence student-facing explanation>",
  "breakdown": {
    "queue_wait_minutes": <number>,
    "active_prep_minutes": <number>,
    "buffer_minutes": <number>
  }
}`;

    const parsed = await this._safeGenerate(prompt);

    if (!parsed) return null;

    return {
      estimatedMinutes: parsed.estimated_prep_minutes,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
      breakdown: parsed.breakdown || null,
    };
  }

  /**
   * Analyze demand patterns
   */
  async analyzeDemandPatterns(data) {
    const prompt = `Analyze campus food vendor order history (30 days):

Orders by hour: ${JSON.stringify(data.ordersByHour)}
Orders by day: ${JSON.stringify(data.ordersByDay)}
Items by time: ${JSON.stringify(data.itemsByTimeSlot)}

Respond ONLY in JSON:
{
  "peak_hours": [{"hour": "HH:MM", "avg_orders": <num>, "intensity": "low|medium|high|extreme"}],
  "recommended_prep_ahead": [{"item": "<name>", "time_slot": "HH:MM", "suggested_quantity": <num>}],
  "slow_periods": [{"start": "HH:MM", "end": "HH:MM"}],
  "weekly_pattern": {"busiest_day": "<day>", "slowest_day": "<day>"},
  "insights": ["<insight1>", "<insight2>"]
}`;

    return await this._safeGenerate(prompt, { maxOutputTokens: 1024, temperature: 0.2 });
  }

  /**
   * Optimize queue order
   */
  async optimizeQueueOrder(activeOrders, vendor) {
    const prompt = `Optimize preparation sequence for food orders:

ORDERS: ${JSON.stringify(activeOrders.map(o => ({
  id: o.token, items: o.items, complexity: o.complexity,
  waitingMinutes: o.waitingMinutes, desiredPickup: o.desiredPickupTime,
})))}

VENDOR: Can prepare ${vendor.maxConcurrent} orders simultaneously.

GOALS: Minimize wait, prioritize near-deadline, batch similar, max 25 min wait.

Respond ONLY in JSON:
{
  "optimized_sequence": ["<token1>", "<token2>"],
  "parallel_groups": [["<token1>", "<token2>"], ["<token3>"]],
  "reasoning": "<brief>"
}`;

    return await this._safeGenerate(prompt);
  }

  /**
   * Get current status of Gemini service
   */
  getStatus() {
    const now = Date.now();
    return {
      available: this._canMakeRequest(),
      requestsThisMinute: this.requestCount,
      maxPerMinute: this.MAX_REQUESTS_PER_MINUTE,
      consecutiveFailures: this.consecutiveFailures,
      cooldownRemaining: this.retryAfter > now
        ? Math.ceil((this.retryAfter - now) / 1000)
        : 0,
    };
  }
}

module.exports = new GeminiService();