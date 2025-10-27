import mongoose, { Schema, InferSchemaType } from 'mongoose'


const ContractSchema = new Schema({
orgId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
quoteId: { type: Schema.Types.ObjectId, ref: 'Quote', required: true },
vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
text: { type: String, required: true },
status: { type: String, enum: ['DRAFT','ACTIVE','TERMINATED','ARCHIVED'], default: 'DRAFT', index: true },
auditFindings: Schema.Types.Mixed, // AI audit output
}, { timestamps: true })


export type ContractDoc = InferSchemaType<typeof ContractSchema>
export default mongoose.models.Contract || mongoose.model('Contract', ContractSchema)