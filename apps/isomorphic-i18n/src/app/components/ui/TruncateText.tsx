import React, { Component } from 'react';

interface TextTruncateProps {
  text: string;
  limit: number; // الحد الأقصى لعدد الكلمات
}

class TextTruncate extends Component<TextTruncateProps> {
  render() {
    const { text, limit } = this.props;
    const words = text.split(' '); // تقسيم النص إلى كلمات
    const truncatedText = words.length > limit ? `${words.slice(0, limit).join(' ')}...` : text; // تقطيع النص إذا زاد عن الحد

    return <h3 className='text-sm font-light text-black/75'>{truncatedText}</h3>; // عرض النص
  }
}

export default TextTruncate;
