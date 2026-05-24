import React from 'react'

function Legend({ border, bg, text, textColor }) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
      "
    >
      <div
        className={`
          w-5
          h-5

          rounded-md

          border

          ${border}

          ${bg}
        `}
      />

      <p
        className={`
          text-sm
          font-medium

          ${textColor}
        `}
      >
        {text}
      </p>
    </div>
  );
}

export default Legend