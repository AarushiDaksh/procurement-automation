import mongoose, { Schema, InferSchemaType } from 'mongoose'


const RfpSchema = new Schema({
orgId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
title: { type: String, required: true },
category: { type: String, enum: ['OFFICE','IT','RAW_MATERIAL'], index: true },
description: String,
requirements: [String],
budgetCeiling: Number,
deliveryWindow: { start: Date, end: Date },
status: { type: String, enum: ['DRAFT','PUBLISHED','CLOSED','AWARDED'], default: 'DRAFT', index: true },
publishedAt: Date,
awardedQuoteId: { type: Schema.Types.ObjectId, ref: 'Quote' },
}, { timestamps: true })


export type RfpDoc = InferSchemaType<typeof RfpSchema>
export default mongoose.models.Rfp || mongoose.model('Rfp', RfpSchema)