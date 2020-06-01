/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose, {Schema, Types, Document, HookSyncCallback, SchemaTypes} from "mongoose";

//export const String = mongoose.Schema.Types.String;
//export const ObjectId = mongoose.Schema.Types.ObjectId;
//export const Mixed = mongoose.Schema.Types.Mixed;

type Mixed = Schema.Types.Mixed;
type ObjectId = Schema.Types.ObjectId;

export interface GeoNoteDocumentInterface {
  text: string;
  links: {
    type: string;
    url: string;
  }[];
  geo: {
    type: string;
    coordinates: [number, number];
  };
  owner: {
    name: string;
    uin: string;
  };
  visibility: {
    audience: string;
    permissions: string[];
  };
  createdAt: Date;
  ttl: Date;
  dist?: {
    calculated?: number;
  };
};

export interface GeoNoteDocument extends mongoose.Document, GeoNoteDocumentInterface {
};


const GeoNoteSchema = new Schema({
  text: {
	   type: Schema.Types.String,
	   required: true
  },
  links: [{
    type: {
      type: Schema.Types.String,
    },
    url: Schema.Types.String
  }],
  geo: {
    type: {
      type: Schema.Types.String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    }
  },
  owner: {
    name: {
      type: Schema.Types.String,
      required: true  
    },
    uin: {
      type: Schema.Types.String,
      required: true  
    }
  },
  visibility: {
    audience: {
      type: Schema.Types.String,
      required: true
    },
    permissions: [ Schema.Types.String ]
  },
  createdAt: {
	   type: Date,
     required: true,
     default: Date.now
  },
  ttl: {
    type: Date,
    required: true
  }
});
GeoNoteSchema.set("autoIndex", false);
GeoNoteSchema.index({geo: "2dsphere"});

export const GeoNoteModel = mongoose.model<GeoNoteDocument>("note", GeoNoteSchema, "notes");

