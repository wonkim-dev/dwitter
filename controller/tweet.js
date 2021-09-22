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
  const tweet = await tweetRepository.getById(id);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
}

export async function createTweet(req, res) {
  const tweet = await tweetRepository.create(req.body.text, req.userId);
  res.status(201).json(tweet);
}

export async function updateTweet(req, res) {
  const id = req.params.id;
  const text = req.body.text;
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
  const tweet = await tweetRepository.getById(req.params.id);
  if (!tweet) {
    return res.sendStatus(400);
  }
  const updated = await tweetRepository.addComment(
    req.userId,
    req.params.id,
    req.body.text
  );
  res.status(200).json(updated);
}

export async function updateComment(req, res) {
  const tweet = await tweetRepository.getById(req.params.id);
  if (!tweet) {
    return res.sendStatus(400);
  }
  const comment = await tweetRepository.updateCommentById(
    req.params.id,
    req.params.commentId,
    req.body.text
  );
  res.status(200).json(comment);
}

export async function deleteComment(req, res) {
  const tweet = await tweetRepository.getById(req.params.id);
  if (!tweet) {
    return res.sendStatus(400);
  }
  const deleted = await tweetRepository.deleteCommentById(
    req.params.id,
    req.params.commentId
  );
  res.status(200).json(deleted);
}
