export class TweetController {
  constructor(tweetRepository) {
    this.tweets = tweetRepository;
  }
  getTweets = async (req, res) => {
    const username = req.query.username;
    const data = await (username
      ? this.tweets.getAllByUsername(username)
      : this.tweets.getAll());
    res.status(200).json(data);
  };

  getTweet = async (req, res) => {
    const id = req.params.id;

    const isValid = this.tweets.validateObjectId(id);
    if (!isValid) {
      return res.sendStatus(404);
    }

    const tweet = await this.tweets.getById(id);
    if (tweet) {
      res.status(200).json(tweet);
    } else {
      res.sendStatus(404);
    }
  };

  createTweet = async (req, res) => {
    const tweet = await this.tweets.create(req.body.text, req.userId);
    res.status(201).json(tweet);
  };

  updateTweet = async (req, res) => {
    const id = req.params.id;
    const text = req.body.text;

    const isValid = this.tweets.validateObjectId(id);
    if (!isValid) {
      return res.sendStatus(404);
    }
    const tweet = await this.tweets.getById(id);
    if (!tweet) {
      return res.sendStatus(404);
    }
    if (req.userId !== tweet.userId) {
      return res.sendStatus(403);
    }

    const updated = await this.tweets.update(id, text);
    res.status(200).json(updated);
  };

  deleteTweet = async (req, res) => {
    const id = req.params.id;

    const isValid = this.tweets.validateObjectId(id);
    if (!isValid) {
      return res.sendStatus(404);
    }
    const tweet = await this.tweets.getById(id);
    if (!tweet) {
      return res.sendStatus(404);
    }
    if (req.userId !== tweet.userId) {
      return res.sendStatus(403);
    }
    await this.tweets.remove(id);
    res.sendStatus(204);
  };

  createComment = async (req, res) => {
    const id = req.params.id;

    const isValid = this.tweets.validateObjectId(id);
    if (!isValid) {
      return res.sendStatus(404);
    }
    const tweet = await this.tweets.getById(id);
    if (!tweet) {
      return res.sendStatus(404);
    }
    const updated = await this.tweets.addComment(req.userId, id, req.body.text);
    res.status(200).json(updated);
  };

  updateComment = async (req, res) => {
    const tweetId = req.params.id;
    const commentId = req.params.commentId;

    const tweetIsValid = this.tweets.validateObjectId(tweetId);
    const commentIsValid = this.tweets.validateObjectId(commentId);
    if (!tweetIsValid || !commentIsValid) {
      return res.sendStatus(404);
    }

    const tweet = await this.tweets.getById(tweetId);
    if (!tweet) {
      return res.sendStatus(404);
    }

    const comment = await this.tweets.getCommentById(tweet, commentId);
    if (!comment) {
      return res.sendStatus(404);
    }

    if (comment.userId !== req.userId) {
      return res.sendStatus(403);
    }

    const updated = await this.tweets.updateCommentById(
      tweetId,
      commentId,
      req.body.text
    );
    res.status(200).json(updated);
  };

  deleteComment = async (req, res) => {
    const tweetId = req.params.id;
    const commentId = req.params.commentId;

    const tweetIsValid = this.tweets.validateObjectId(tweetId);
    const commentIsValid = this.tweets.validateObjectId(commentId);
    if (!tweetIsValid || !commentIsValid) {
      return res.sendStatus(404);
    }

    const tweet = await this.tweets.getById(tweetId);
    if (!tweet) {
      return res.sendStatus(404);
    }

    const comment = await this.tweets.getCommentById(tweet, commentId);
    if (!comment) {
      return res.sendStatus(404);
    }

    if (comment.userId !== req.userId) {
      return res.sendStatus(403);
    }

    const deleted = await this.tweets.deleteCommentById(tweetId, commentId);
    res.status(200).json(deleted);
  };
}
