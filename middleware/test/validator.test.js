import httpMocks from "node-mocks-http";
import faker from "faker";
import { validate } from "../validator.js";
import * as validator from "express-validator";

jest.mock("express-validator");

describe("Validator Middleware", () => {
  it("calls next if there is no validation error", () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const next = jest.fn();
    validator.validationResult = jest.fn(() => {
      return { isEmpty: () => true };
    });

    validate(request, response, next);

    expect(next).toHaveBeenCalled();
  });

  it("returns 400 if there is validation error", () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const next = jest.fn();
    const errorMsg = faker.random.words(3);
    validator.validationResult = jest.fn(() => {
      return {
        isEmpty: () => false,
        array: () => [{ msg: errorMsg }],
      };
    });

    validate(request, response, next);

    expect(next).not.toBeCalled();
    expect(response.statusCode).toBe(400);
    expect(response._getJSONData().message).toBe(errorMsg);
  });
});
