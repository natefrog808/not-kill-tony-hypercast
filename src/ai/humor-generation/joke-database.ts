// src/ai/humor-generation/joke-database.ts

interface Joke {
  id: string;
  setup: string;
  punchline: string;
  tags: string[];
  context: string[];
  style: string[];
  rating: number;
  usageCount: number;
  lastUsed?: Date;
}

interface JokeQuery {
  context: string;
  minRating?: number;
  style?: string[];
  excludeIds?: string[];
  limit?: number;
}

export class JokeDatabase {
  private jokes: Map<string, Joke>;
  private contextIndex: Map<string, Set<string>>;
  private styleIndex: Map<string, Set<string>>;

  constructor() {
    this.jokes = new Map();
    this.contextIndex = new Map();
    this.styleIndex = new Map();
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    // Initialize with some sample jokes
    const sampleJokes: Joke[] = [
      {
        id: '1',
        setup: 'Why did the programmer quit his job?',
        punchline: 'Because he didn't get arrays!',
        tags: ['programming', 'wordplay'],
        context: ['technology', 'work'],
        style: ['nerdy', 'wordplay'],
        rating: 4.5,
        usageCount: 0
      },
      {
        id: '2',
        setup: 'What do you call a bear with no teeth?',
        punchline: 'A gummy bear!',
        tags: ['animals', 'wordplay'],
        context: ['nature', 'food'],
        style: ['cute', 'wordplay'],
        rating: 4.0,
        usageCount: 0
      }
    ];

    sampleJokes.forEach(joke => this.addJoke(joke));
  }

  async getJokesByContext(context: string): Promise<string[]> {
    const query: JokeQuery = {
      context,
      minRating: 3.5,
      limit: 5
    };

    const jokes = await this.queryJokes(query);
    return jokes.map(joke => `${joke.setup}\n${joke.punchline}`);
  }

  async addJoke(joke: Joke): Promise<void> {
    // Add to main jokes map
    this.jokes.set(joke.id, joke);

    // Index by context
    joke.context.forEach(ctx => {
      if (!this.contextIndex.has(ctx)) {
        this.contextIndex.set(ctx, new Set());
      }
      this.contextIndex.get(ctx)?.add(joke.id);
    });

    // Index by style
    joke.style.forEach(style => {
      if (!this.styleIndex.has(style)) {
        this.styleIndex.set(style, new Set());
      }
      this.styleIndex.get(style)?.add(joke.id);
    });
  }

  async updateJokeRating(jokeId: string, rating: number): Promise<void> {
    const joke = this.jokes.get(jokeId);
    if (joke) {
      joke.rating = (joke.rating + rating) / 2;
      this.jokes.set(jokeId, joke);
    }
  }

  async incrementUsageCount(jokeId: string): Promise<void> {
    const joke = this.jokes.get(jokeId);
    if (joke) {
      joke.usageCount += 1;
      joke.lastUsed = new Date();
      this.jokes.set(jokeId, joke);
    }
  }

  private async queryJokes(query: JokeQuery): Promise<Joke[]> {
    const contextJokes = this.getJokesByContextIndex(query.context);
    
    let filteredJokes = Array.from(contextJokes)
      .map(id => this.jokes.get(id)!)
      .filter(joke => {
        if (query.minRating && joke.rating < query.minRating) return false;
        if (query.excludeIds?.includes(joke.id)) return false;
        if (query.style && !joke.style.some(s => query.style?.includes(s))) return false;
        return true;
      });

    // Sort by rating and freshness
    filteredJokes.sort((a, b) => {
      const ratingDiff = b.rating - a.rating;
      if (ratingDiff !== 0) return ratingDiff;
      
      const aLastUsed = a.lastUsed?.getTime() || 0;
      const bLastUsed = b.lastUsed?.getTime() || 0;
      return aLastUsed - bLastUsed;
    });

    if (query.limit) {
      filteredJokes = filteredJokes.slice(0, query.limit);
    }

    return filteredJokes;
  }

  private getJokesByContextIndex(context: string): Set<string> {
    const result = new Set<string>();
    
    // Split context into keywords
    const keywords = context.toLowerCase().split(/\s+/);
    
    // Collect jokes that match any keyword
    keywords.forEach(keyword => {
      const matches = this.contextIndex.get(keyword);
      if (matches) {
        matches.forEach(jokeId => result.add(jokeId));
      }
    });

    return result;
  }
