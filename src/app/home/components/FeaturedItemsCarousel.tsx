"use client";

import React, { useEffect, useRef, useState } from "react";
import { ItemCard } from "@/components/ItemCard";
import { storeItem } from "@/app/types";
import { ArrowButtons } from "@/components/ArrowButtons";

type Props = {
  featuredItems: storeItem[];
};

export function FeaturedItemsCarousel({ featuredItems }: Props) {
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [lastItemVisible, setLastItemVisible] = useState(false);
  const lastItemRef = useRef<HTMLDivElement>(null);

  function moveRight() {
    if (currentScrollIndex < featuredItems.length - 1) {
      setCurrentScrollIndex((prev) => prev + 1);
    }
  }

  function moveLeft() {
    if (currentScrollIndex > 0) {
      setCurrentScrollIndex((prev) => prev - 1);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const lastItemEntry = entries[0];
        if (lastItemEntry.isIntersecting) {
          setLastItemVisible(true);
        } else {
          setLastItemVisible(false);
        }
      },
      { threshold: 1 },
    );

    addEventListener("resize", () => {
      setCurrentScrollIndex(0);
    });

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      removeEventListener("resize", () => {
        setCurrentScrollIndex(0);
      });

      if (lastItemRef.current) {
        observer.unobserve(lastItemRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full overflow-scroll overflow-y-visible md:overflow-x-hidden">
      <div
        className="flex gap-4 overflow-y-visible px-20 transition-all duration-500"
        style={{ transform: `translateX(-${currentScrollIndex * 50}%)` }}
      >
        {featuredItems.map((item, itemIndex) => (
          <div
            className="my-10"
            key={item.id}
            ref={itemIndex === featuredItems.length - 1 ? lastItemRef : null}
          >
            <ItemCard item={item} />
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <ArrowButtons
          lastItemVisible={lastItemVisible}
          currentScrollIndex={currentScrollIndex}
          moveLeft={moveLeft}
          moveRight={moveRight}
        />
      </div>
    </div>
  );
}
