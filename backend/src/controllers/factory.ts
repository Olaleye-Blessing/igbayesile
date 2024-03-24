/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from '@/utils/catchAsync';
import FilterFeatures from '@/utils/filterFeatures';
import { Model } from 'mongoose';

/** 
 * model: Model<
    IDoc,
    QueryWithHelpers<IDoc[], IDoc, object, IDoc, 'find'>,
    any, // TInstanceMethods
    any, // TVirtuals
    any, // THydratedDocumentType
    any // TSchema
  >,
  key = 'docs',
*/

export const findAll = <IDoc>(
  model: Model<
    IDoc,
    any
    // QueryWithHelpers<IDoc[], IDoc, object, IDoc, 'find'>,
    // any, // TInstanceMethods
    // any, // TVirtuals
    // any, // THydratedDocumentType
    // any // TSchema
  >,
  key = 'docs',
) =>
  catchAsync(async (req, res) => {
    const features = new FilterFeatures<IDoc>(model.find(), { ...req.query })
      .filter(
        // TODO: update request type to have this object on all request.
        // I used this name casue express should never have this name internally
        ((req.query.igbayesile as any).filterNumKeys as string[]) || [],
        (req.query.igbayesile as any).filter || {},
      )
      .fields()
      .sort()
      .paginate();

    const docs = await features.query;

    return res.status(200).json({
      status: 'success',
      data: {
        [key]: docs,
        total: docs.length,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10),
        // specify if there is a next page
      },
    });
  });
