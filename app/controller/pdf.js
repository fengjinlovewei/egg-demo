// app/controller/news.js
const Controller = require('egg').Controller;

class PDFController extends Controller {
  async get() {
    const ctx = this.ctx;
    const url = ctx.query.url || 'http://localhost:9001/news';
    const data = await ctx.service.pdf.get(url);

    ctx.set('Content-Type', 'application/pdf'); // 设置内容类型
    ctx.body = data
  }
}

module.exports = PDFController;