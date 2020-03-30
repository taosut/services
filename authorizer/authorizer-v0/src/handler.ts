import { Context, Handler } from 'aws-lambda';
import { authorizerBase } from './authorizer/authorizerBase';

export const learner: Handler = (
  event: any,
  context: Context,
  callback: any
): any => {
  return authorizerBase(event, context, callback);
};

export const admin: Handler = (
  event: any,
  context: Context,
  callback: any
): any => {
  return authorizerBase(event, context, callback, 'admin');
};

export const author: Handler = (
  event: any,
  context: Context,
  callback: any
): any => {
  return authorizerBase(event, context, callback, 'author');
};

export const authorDirector: Handler = (
  event: any,
  context: Context,
  callback: any
): any => {
  return authorizerBase(event, context, callback, 'authorDirector');
};

export const manager: Handler = (
  event: any,
  context: Context,
  callback: any
): any => {
  return authorizerBase(event, context, callback, 'manager');
};
