// app/service/news.js
const Service = require("egg").Service;

const pdftk = require("node-pdftk");

const puppeteer = require("puppeteer");
const { createPool } = require("generic-pool");

const factory = {
  create: async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        // "--single-process", // 这个代码还是别用了，有问题报错
      ],
    });
    return browser;
  },
  destroy: (browser) => {
    browser.close();
  },
};

const browserPool = createPool(factory, {
  min: 4,
  max: 6,
});

// 定时检查空闲的浏览器页签并关闭

async function loop() {
  try {
    const availablePages = await browserPool.available;
    // 当浏览器页面数量超过阈值时，关闭一个空闲的页面
    if (availablePages > 1) {
      const browser = await browserPool.acquire();
      const pages = await browser.pages();
      for (const [index, page] of pages.entries()) {
        if (index < pages.length - 1) {
          await page.close();
        }
      }
      browserPool.release(browser);
    }
  } finally {
    setTimeout(loop, 500); // 每隔ms检查一次
  }
}

setTimeout(loop, 500);

class RenderPDF {
  async cover({ url }) {
    const browser = await browserPool.acquire();
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1000, height: 1122 });
      await page.goto(url, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
      browserPool.release(browser);
      return pdfBuffer;
    } catch (e) {
      browserPool.release(browser);
      console.log(e);
    }
  }
  async report({ url, headerTemplate, footerTemplate }) {
    const browser = await browserPool.acquire();
    try {
      console.log("渲染报告");
      const page = await browser.newPage();
      await page.setViewport({ width: 1000, height: 1222 });
      await page.goto(url, { waitUntil: "networkidle0" });
      // 延时，等待页面渲染完成
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true, // 页眉和页脚
        displayHeaderFooter: true,
        headerTemplate,
        footerTemplate,
        margin: {
          top: 100,
          bottom: 80,
        },
      });
      browserPool.release(browser);
      return pdfBuffer;
    } catch (e) {
      browserPool.release(browser);
      console.log('report-error', e);
    }
  }
}

class NewsService extends Service {
  async get(url) {
    debugger
    const renderPDF = new RenderPDF();
    const cover_buffer = await renderPDF.cover({ url });
    const report_buffer = await renderPDF.report({
      url,
      headerTemplate: "<div>header</div>",
      footerTemplate: "<div>footer</div>",
    });

    const pdf_buffer = [ cover_buffer, report_buffer];
    const pdfBytes = await pdftk.input(pdf_buffer).output();

    return pdfBytes;
  }
}

module.exports = NewsService;
