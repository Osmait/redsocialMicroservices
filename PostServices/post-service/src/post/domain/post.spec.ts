import { Post } from './post.entity';

describe('Post', () => {
  it('should be defined', () => {
    expect(new Post()).toBeDefined();
  });
});
