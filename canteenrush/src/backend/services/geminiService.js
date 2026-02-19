const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with your key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    });

    this.requestCount = 0;
    this.minuteStart = Date.now();
    this.MAX_REQUESTS_PER_MINUTE = 10;
    this.retryAfter = 0;
    this.consecutiveFailures = 0;
    this.MAX_CONSECUTIVE_FAILURES = 3;
    this.backoffUntil = null;
  }

  _canMakeRequest() {
    const now = Date.now();
    if (now < this.retryAfter) return false;
    if (this.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES) {
      if (!this.backoffUntil || now > this.backoffUntil) {
        this.consecutiveFailures = 0;
        this.backoffUntil = null;
      } else {
        return false;
      }
    }
    if (now - this.minuteStart > 60000) {
      this.requestCount = 0;
      this.minuteStart = now;
    }
    return this.requestCount < this.MAX_REQUESTS_PER_MINUTE;
  }

  _handleError(error) {
    this.consecutiveFailures++;
    if (error.message?.includes('429')) {
      this.retryAfter = Date.now() + 60000;
    } else {
      this.backoffUntil = Date.now() + 120000;
    }
  }

  /**
   * Safe wrapper that actually calls the API and repairs broken JSON
   */
  async _safeGenerate(prompt, config = {}) {
    if (!this._canMakeRequest()) return null;
    this.requestCount++;

    try {
      console.log("🚀 Sending Prompt to Gemini...");
      
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, 
          maxOutputTokens: 512,
          ...config,
        },
      });

      const response = await result.response;
      let text = response.text().trim();
      console.log("✅ Gemini Responded!");

      // 1. Remove markdown and cleanup whitespace
      text = text.replace(/^```json/, "").replace(/```$/, "").trim();

      // 2. THE ADVANCED AUTO-FIX: 
      // If truncated at a comma like: {"time": 20, 
      // Remove everything from the last comma onwards before closing
      if (text.includes(',') && !text.includes('}', text.lastIndexOf(','))) {
          text = text.substring(0, text.lastIndexOf(','));
      }

      // Ensure it has an even number of quotes
      const quoteCount = (text.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) text += '"';

      // Ensure it ends with a brace
      if (!text.endsWith('}')) text += '}';

      console.log("📝 Sanitized Text for Parsing:", text);
      
      this.consecutiveFailures = 0;
      return JSON.parse(text);

    } catch (error) {
      console.error("❌ Gemini Service Error:", error.message);
      this._handleError(error);
      return null;
    }
  }

  async predictPrepTime(ctx) {
    // We move the important data to the FRONT so if it gets cut off, 
    // we still have the minutes and the confidence.
    const prompt = `Predict food prep minutes for Items: ${JSON.stringify(ctx.items)}. 
    Queue: ${ctx.queueDepth}.
    Return ONLY JSON: {"estimated_prep_minutes": 15, "confidence": 0.9, "reasoning": "Brief explanation"}`;

    return await this._safeGenerate(prompt);
  }
}
module.exports = new GeminiService();