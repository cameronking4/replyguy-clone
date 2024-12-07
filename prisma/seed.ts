import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import range from "lodash/range";

const prisma = new PrismaClient();
const userId = "clyl7zmed0000131phqc4enmt";

class Seeder {
  protected count: number;
  protected _data: any = [];

  constructor(count: number) {
    this.count = count;
  }

  protected createData(): void {}

  get data(): any[] {
    return this._data;
  }
}

class CampaignSeed extends Seeder {
  constructor(count: number = 10) {
    super(count);
    this.createData();
  }

  protected createData() {
    this._data.push({
      userId: userId,
      category: "SaaS_STARTUP",
      name: "BuzzDaddy Campaign",
      businessUrl: "https://BuzzDaddy.com",
      description:
        "An AI-powered social media scraping tool to boost leads for business. Customers simply describe their business and BuzzDaddy AI agents promote it on their behalf with clever replies & posts across Twitter, LinkedIn & Reddit.",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    range(this.count).forEach(() => {
      this._data.push({
        userId: userId,
        category: faker.helpers.arrayElement([
          "SaaS_STARTUP",
          "AGENCY",
          "ECOMMERCE_STORE",
          "NEWSLETTER",
          "COMMUNITY",
          "PHYSICAL_PRODUCT",
          "FREELANCER",
          "CONTENT_MAKER",
          "ARTIST",
        ]),
        name: faker.company.name(),
        businessUrl: faker.internet.url(),
        description: faker.lorem.paragraph(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }
}

class NotificationSeed extends Seeder {
  private campaignIds: string[];

  constructor(campaignIds: string[], count: number = 10) {
    super(count);
    this.campaignIds = campaignIds;
    this.createData();
  }

  protected createData() {
    const predefinedNotifications = [
      {
        message:
          "BuzzDaddy successfully detected 382 new posts across social platforms",
        read: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        updatedAt: new Date(),
      },
      {
        message:
          "BuzzDaddy commented on X post 'Networking on social media isn't just about...'",
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        updatedAt: new Date(),
      },
      {
        message:
          "BuzzDaddy created a post in Reddit community 'SocialMediaMarketing'",
        read: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        updatedAt: new Date(),
      },
      {
        message:
          "BuzzDaddy successfully detected 4176 posts across social platforms",
        read: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        updatedAt: new Date(),
      },
      {
        message: "Campaign for BuzzDaddy successfully started",
        read: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(),
      },
    ];

    predefinedNotifications.forEach((notification, index) => {
      this._data.push({
        ...notification,
        userId: userId,
        campaignId: this.campaignIds[index % this.campaignIds.length],
      });
    });

    range(this.count).forEach(() => {
      this._data.push({
        userId: userId,
        campaignId: faker.helpers.arrayElement(this.campaignIds),
        message: faker.lorem.sentence(),
        read: faker.datatype.boolean(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }
}

class KeywordSeed extends Seeder {
  private campaignIds: string[];

  constructor(campaignIds: string[], count: number = 10) {
    super(count);
    this.campaignIds = campaignIds;
    this.createData();
  }

  protected createData() {
    const predefinedKeywords = [
      ["AI", "Machine Learning", "Web Development"],
      ["Marketing", "SEO", "Content Creation"],
      ["Social Media", "Engagement", "Growth Hacking"],
      ["E-commerce", "Sales", "Conversion"],
      ["Community Building", "Networking", "Support"],
    ];

    predefinedKeywords.forEach((keywords, index) => {
      keywords.forEach((keyword) => {
        this._data.push({
          campaignId: this.campaignIds[index % this.campaignIds.length],
          keyword: keyword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    range(this.count).forEach(() => {
      this._data.push({
        campaignId: faker.helpers.arrayElement(this.campaignIds),
        keyword: faker.commerce.product(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }
}

const main = async () => {
  try {
    // Deleting existing data
    await prisma.$transaction([
      prisma.notification.deleteMany(),
      prisma.campaign.deleteMany(),
      prisma.keyword.deleteMany(),
    ]);

    // Seeding new data
    const campaignSeed = new CampaignSeed(5);
    const campaignsData = campaignSeed.data;

    const campaigns: any[] = [];
    for (const campaignData of campaignsData) {
      const campaign = await prisma.campaign.create({ data: campaignData });
      campaigns.push(campaign);
    }
    const campaignIds = campaigns.map((campaign) => campaign.id);

    const notificationSeed = new NotificationSeed(campaignIds, 5);
    await prisma.notification.createMany({ data: notificationSeed.data });

    const keywordSeed = new KeywordSeed(campaignIds, 5);
    await prisma.keyword.createMany({ data: keywordSeed.data });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
