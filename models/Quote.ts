import mongoose, { Schema, InferSchemaType } from 'mongoose'


const QuoteSchema = new Schema({
rfpId: { type: Schema.Types.ObjectId, ref: 'Rfp', index: true, required: true },
vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', index: true, required: true },
items: [{ sku: String, name: String, qty: Number, unitPrice: Number }],
total: { type: Number, required: true },
deliveryDays: Number,
compliance: { meetsReqs: Boolean, notes: String },
score: { type: Number, default: 0 }, // AI score
scoreBreakdown: Schema.Types.Mixed, // e.g., { cost: 0.6, delivery: 0.3, compliance: 0.1 }
status: { type: String, enum: ['SUBMITTED','REVISED','WITHDRAWN','AWARDED','REJECTED'], index: true },
}, { timestamps: true })


export type QuoteDoc = InferSchemaType<typeof QuoteSchema>
export default mongoose.models.Quote || mongoose.model('Quote', QuoteSchema)