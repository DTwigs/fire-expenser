import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./Categorization.css";

export type AnimatedItemsUpdatedRef = {
  add: (itemsUpdated: number) => void;
};

/*
This component is going to create a new element every time you call .add()
This is so the there can be multiple items animating at the same time.
*/
export const AnimatedItemsUpdated = forwardRef((_, ref) => {
  const [elArray, setElArray] = useState<
    Array<{ key: number; itemsUpdated: number }>
  >([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    add: (itemsUpdated: number) => {
      const nextKey = (elArray[elArray.length - 1]?.key ?? 0) + 1;
      setElArray([...elArray, { key: nextKey, itemsUpdated }]);
    },
  }));

  useEffect(() => {
    if (elArray.length === 0) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      setElArray([]);
      timeoutRef.current = null;
    }, 1980);
  }, [elArray]);

  return (
    <>
      {elArray.map(({ key, itemsUpdated }) => (
        <div className="items-updated-container" key={key}>
          {itemsUpdated} item{itemsUpdated > 1 ? "s" : ""} updated!
        </div>
      ))}
    </>
  );
});
