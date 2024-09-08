import React from 'react';
import { ImgHTMLAttributes } from 'react';

export default function CustomImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  return <img loading="lazy" decoding="async" alt={props.alt || ''} {...props} />;
}
