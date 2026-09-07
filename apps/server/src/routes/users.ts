import { Router } from 'express';
import type { CreateUserInput, ListUsersQuery, UpdateUserInput } from '@mono/shared';
import { createUserSchema, listUsersQuerySchema, updateUserSchema } from '@mono/shared';
import { ok } from '../lib/response';
import { validate } from '../middlewares/validate';
import * as userService from '../services/user-service';

export const usersRouter = Router();

usersRouter.get('/', validate(listUsersQuerySchema, 'query'), (req, res) => {
  const query = req.query as unknown as ListUsersQuery;
  res.json(ok(userService.listUsers(query)));
});

usersRouter.get('/:id', (req, res) => {
  res.json(ok(userService.getUser(String(req.params.id))));
});

usersRouter.post('/', validate(createUserSchema), (req, res) => {
  const created = userService.createUser(req.body as CreateUserInput);
  res.status(201).json(ok(created));
});

usersRouter.patch('/:id', validate(updateUserSchema), (req, res) => {
  const updated = userService.updateUser(String(req.params.id), req.body as UpdateUserInput);
  res.json(ok(updated));
});

usersRouter.delete('/:id', (req, res) => {
  res.json(ok(userService.deleteUser(String(req.params.id))));
});
