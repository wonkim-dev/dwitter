import * as tweetRepository from "../data/tweet.js";

export async function getTweets(req, res) {
  const username = req.query.username;
  const data = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());
  res.status(200).json(data);
}

export async function getTweet(req, res) {
  const id = req.params.id;

  const isValid = tweetRepository.validateObjectId(id);
  if (!isValid) {
    return res.sendStatus(404);
  }

  const tweet = await tweetRepository.getById(id);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.sendStatus(404);
  }
}

export async function createTweet(req, res) {
  const tweet = await tweetRepository.create(req.body.text, req.userId);
  res.status(201).json(tweet);
}

export async function updateTweet(req, res) {
  const id = req.params.id;
  const text = req.body.text;

  const isValid = tweetRepository.validateObjectId(id);
  if (!isValid) {
    return res.sendStatus(404);
  }
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.sendStatus(404);
  }
  if (req.userId !== tweet.userId) {
    return res.sendStatus(403);
  }

  const updated = await tweetRepository.update(id, text);
  res.status(200).json(updated);
}

export async function deleteTweet(req, res) {
  const id = req.params.id;

  const isValid = tweetRepository.validateObjectId(id);
  if (!isValid) {
    return res.sendStatus(404);
  }
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.sendStatus(404);
  }
  if (req.userId !== tweet.userId) {
    return res.sendStatus(403);
  }
  await tweetRepository.remove(id);
  res.sendStatus(204);
}

export async function createComment(req, res) {
  const id = req.params.id;

  const isValid = tweetRepository.validateObjectId(id);
  if (!isValid) {
    return res.sendStatus(404);
  }
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.sendStatus(404);
  }
  const updated = await tweetRepository.addComment(
    req.userId,
    id,
    req.body.text
  );
  res.status(200).json(updated);
}

export async function updateComment(req, res) {
  const tweetId = req.params.id;
  const commentId = req.params.commentId;

  const tweetIsValid = tweetRepository.validateObjectId(tweetId);
  const commentIsValid = tweetRepository.validateObjectId(commentId);
  if (!tweetIsValid || !commentIsValid) {
    return res.sendStatus(404);
  }

  const tweet = await tweetRepository.getById(tweetId);
  if (!tweet) {
    return res.sendStatus(404);
  }

  const comment = await tweetRepository.getCommentById(tweet, commentId);
  if (!comment) {
    return res.sendStatus(404);
  }

  if (comment.userId !== req.userId) {
    return res.sendStatus(403);
  }

  const updated = await tweetRepository.updateCommentById(
    tweetId,
    commentId,
    req.body.text
  );
  res.status(200).json(updated);
}

export async function deleteComment(req, res) {
  const tweetId = req.params.id;
  const commentId = req.params.commentId;

  const tweetIsValid = tweetRepository.validateObjectId(tweetId);
  const commentIsValid = tweetRepository.validateObjectId(commentId);
  if (!tweetIsValid || !commentIsValid) {
    return res.sendStatus(404);
  }

  const tweet = await tweetRepository.getById(tweetId);
  if (!tweet) {
    return res.sendStatus(404);
  }

  const comment = await tweetRepository.getCommentById(tweet, commentId);
  if (!comment) {
    return res.sendStatus(404);
  }

  if (comment.userId !== req.userId) {
    return res.sendStatus(403);
  }

  const deleted = await tweetRepository.deleteCommentById(tweetId, commentId);
  res.status(200).json(deleted);
}
