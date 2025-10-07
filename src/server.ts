import express, { Request, Response } from "express";
import { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";

const port = process.env.port || 5000;

let server: any = Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.2xrwvsn.mongodb.net/ph-tour?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log("Connected to DB!!");

    server = app.listen(port, () =>
      console.log(`Server is running on port ${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
