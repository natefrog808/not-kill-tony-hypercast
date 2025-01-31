```typescript
import { DataAggregator } from './data';
import { ChartGenerator } from './charts';
import { PDFGenerator } from './pdf';
import { ExcelGenerator } from './excel';
import { Logger } from './logger';
import { EmailService } from './email';

class ReportingEngine {
  private dataAggregator: DataAggregator;
  private chartGenerator: ChartGenerator;
  private pdfGenerator: PDFGenerator;
  private excelGenerator: ExcelGenerator;
  private logger: Logger;
  private emailService: EmailService;

  constructor() {
    this.dataAggregator = new DataAggregator();
    this.chartGenerator = new ChartGenerator();
    this.pdfGenerator = new PDFGenerator();
    this.excelGenerator = new ExcelGenerator();
    this.logger = new Logger();
    this.emailService = new EmailService();
  }

  async generateReport(config: ReportConfig): Promise<Report> {
    try {
      // Collect and aggregate data in parallel
      const data = await this.collectData(config);

      // Generate visualizations
      const visualizations = await this.generateVisualizations(data);

      // Create report content
      const content = await this.createReportContent(data, visualizations);

      // Export in requested format
      const report = await this.exportReport(content, config.format);

      // Distribute the report
      await this.distributeReport(report, config.recipients);

      return report;
    } catch (error) {
      this.logger.error(`Report generation failed: ${error.message}`);
      throw new Error(`Report generation failed: ${error.message}`);
    }
  }

  private async collectData(config: ReportConfig): Promise<ReportData> {
    return await Promise.all([
      this.dataAggregator.collectShowMetrics(config.dateRange),
      this.dataAggregator.collectAudienceMetrics(config.dateRange),
      this.dataAggregator.collectPerformerMetrics(config.dateRange),
      this.dataAggregator.collectEngagementMetrics(config.dateRange)
    ]);
  }

  private async generateVisualizations(data: ReportData): Promise<ReportVisuals> {
    return {
      charts: await this.chartGenerator.generateCharts(data),
      tables: await this.chartGenerator.generateTables(data),
      graphs: await this.chartGenerator.generateGraphs(data)
    };
  }

  private async createReportContent(
    data: ReportData,
    visuals: ReportVisuals
  ): Promise<ReportContent> {
    const contentGenerator = new ContentGenerator();

    return {
      executiveSummary: await contentGenerator.createExecutiveSummary(data),
      sections: await this.generateReportSections(data, visuals),
      recommendations: await contentGenerator.generateRecommendations(data),
      metadata: this.generateReportMetadata()
    };
  }

  private async generateReportSections(
    data: ReportData,
    visuals: ReportVisuals
  ): Promise<ReportSection[]> {
    return [
      await this.generateShowSection(data, visuals),
      await this.generateAudienceSection(data, visuals),
      await this.generatePerformerSection(data, visuals),
      await this.generateEngagementSection(data, visuals)
    ];
  }

  private async exportReport(content: ReportContent, format: string): Promise<Buffer> {
    switch (format) {
      case 'pdf':
        return this.pdfGenerator.generate(content);
      case 'excel':
        return this.excelGenerator.generate(content);
      default:
        throw new Error('Unsupported format');
    }
  }

  private async distributeReport(report: Buffer, recipients: string[]): Promise<void> {
    try {
      await this.emailService.sendEmails(recipients, report);
    } catch (error) {
      this.logger.error(`Failed to distribute report: ${error.message}`);
    }
  }
}

export { ReportingEngine };
```
