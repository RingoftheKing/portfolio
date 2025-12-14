import React from "react";
interface badgeItems {
    items: string[];
}

const badgeList = ({badgeList} : {badgeList: badgeItems}) => {
  return <div className="flex flex-wrap items-center justify-around gap-x-10 gap-y-4">
      {badgeList.items.map((item, index) => {
          return <span className="badge badge-outline justify-center badge-sm md:badge-lg" key={index}>
              {item}
          </span>
      })}
  </div>
}

export default badgeList;
