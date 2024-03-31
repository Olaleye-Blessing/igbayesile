/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from '@/utils/catchAsync';
import FilterFeatures from '@/utils/filterFeatures';
import { Model, PopulateOptions } from 'mongoose';

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
  populateOpts: PopulateOptions[] = [],
) =>
  catchAsync(async (req, res) => {
    const features = new FilterFeatures<IDoc>(model.find(), { ...req.query })
      .filter()
      .fields()
      .sort()
      .paginate();

    const query = features.query;
    if (populateOpts.length > 0) {
      populateOpts.forEach((option) => {
        query.populate(option);
      });
    }

    const [total, docs] = await Promise.all([
      model.countDocuments(features.queryFilter),
      query,
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        results: docs,
        total,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10),
      },
    });
  });
