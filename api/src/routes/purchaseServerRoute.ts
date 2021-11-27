import { createApplicationContext } from '../createApplicationContext';
import { plans } from '../data/plans';

import { Request, Response } from 'express';
import { purchaseServerInteractor } from '../interactors/purchaseServerInteractor';
export interface IAuthRequest extends Request {
  user: any;
}

export const purchaseServerRoute = async (req: IAuthRequest, res: Response) => {
  const { planId } = req.body;
  const plan = plans.find(p => p.plan === planId);
  const applicationContext = createApplicationContext();
  try {
    const ret = await purchaseServerInteractor({
      plan,
      user: req.user,
      applicationContext,
    });
    return res.send(ret);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};