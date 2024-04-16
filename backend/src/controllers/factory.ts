/* eslint-disable @typescript-eslint/no-explicit-any */
import { redisClient } from '@/databases/redis';
import { IFindAll } from '@/interfaces/factory';
import catchAsync from '@/utils/catchAsync';
import FilterFeatures from '@/utils/filterFeatures';

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

export const findAll = <IDoc>({ model, populateOpts = [], cache }: IFindAll<IDoc>) =>
  catchAsync(async (req, res) => {
    if (!cache) cache = req.factory?.cache;

    if (cache) {
      const cachedData = await redisClient.get(req.originalUrl);

      if (cachedData) {
        return res
          .status(304)
          .json({ status: 'success', data: JSON.parse(cachedData) });
      }
    }

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

    const data = {
      results: docs,
      total,
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 10),
    };

    if (cache) {
      await redisClient.set(req.originalUrl, JSON.stringify(data), {
        EX: cache.maxAge,
      });

      let cacheControl = `max-age=${cache.maxAge}`;
      if (cache.directives) cacheControl += `, ${cache.directives.join(', ')}`;

      res.set('Cache-Control', cacheControl);
    }

    return res.status(200).json({
      status: 'success',
      data,
    });
  });
