const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function notFoundResponse(response, id) {
  const message = { error: `Repository ${id} not found!` };

  return response
    .status(400)
    .json(message);
}

app.get("/repositories", (request, response) => {
  return response
    .status(200)
    .json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repository);

  return response
    .status(200)
    .json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return notFoundResponse(response, id);
  }

  const repo = repositories[repoIndex];

  const repository = {
    ...repo,
    title: title,
    url: url,
    techs: techs
  }

  repositories[repoIndex] = repository;

  return response
    .status(200)
    .json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return notFoundResponse(response, id);
  }

  repositories.splice(repoIndex, 1);

  return response
    .status(204)
    .json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return notFoundResponse(response, id);
  }

  const repo = repositories[repoIndex];

  const repository = {
    ...repo,
    likes: ++repo.likes
  }

  repositories[repoIndex] = repository;

  return response
    .status(200)
    .json(repository);
});

module.exports = app;
