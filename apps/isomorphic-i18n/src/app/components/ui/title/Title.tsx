import React from 'react'

const Title = ({ title, className = '' }: { title: string, className?: string }) => {
  return (
    <>
      <div className={`mb-5 ${className}`}>
        <h2 className="font-bold text-xl md:text-3xl 4xl:text-5xl">
          {title}
        </h2>
      </div>
    </>
  );
}

export default Title;
