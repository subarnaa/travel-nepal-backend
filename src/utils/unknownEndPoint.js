// import { Request, Response } from "express";

/**
 * * For unknown enpoint handler
 */

const unknownEndPointHandler = (_req, res) => {
  res.send({ message: "unknown endpoint" });
};

export default unknownEndPointHandler;
