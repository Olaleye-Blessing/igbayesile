import { IReview } from '@/interfaces/review';
import mongoose, { Model, model, Schema } from 'mongoose';
import Hotel from './hotel';
import Room from './room';

interface ReviewModel extends Model<IReview, object> {
  calcHotelOrRoomAvgRating(type: 'hotel' | 'room', id: string): void;
}

const reviewSchema = new Schema<IReview>({
  content: {
    type: String,
    required: [true, "Review content can't be empty"],
    trim: true,
  },
  rating: {
    type: Number,
    default: 3,
    min: [1, 'Minimum rating is 1'],
    max: [5, 'Maxmimum rating is 5'],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Provide the owner of the review'],
  },
  type: {
    type: String,
    enum: {
      values: ['hotel', 'room'],
      message: 'You can only be a hotel or room',
    },
    required: [true, 'Provide the hotel/room you are reviewing'],
  },
  targetId: {
    type: String,
    required: [true, 'Provide the id of the hotel/room'],
  },
});

reviewSchema.index({ type: 1, targetId: 1, userId: 1 }, { unique: true });

reviewSchema.static(
  'calcHotelOrRoomAvgRating',
  async function (type: 'hotel' | 'room', targetId: string) {
    let [stat] = await this.aggregate([
      {
        $match: { type, targetId },
      },
      {
        $group: {
          _id: '$targetId',
          totalReviews: { $sum: 1 },
          ratings: { $avg: '$rating' },
        },
      },
    ]);

    if (!stat) stat = { totalReviews: 0, ratings: 0 };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TargetModel: Model<any, any> | null =
      type === 'hotel' ? Hotel : type === 'room' ? Room : null;

    if (!TargetModel) return;

    await TargetModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(targetId),
      stat,
    );
  },
);

reviewSchema.post('save', function () {
  // @ts-expect-error Valid
  this.constructor.calcHotelOrRoomAvgRating(this.type, this.targetId);
});

// TODO: Complete this when there is a route to update/delete reviews
reviewSchema.pre(/^findOneand/, async function (next) {
  next();
});

const Review = model<IReview, ReviewModel>('Review', reviewSchema);

export default Review;
