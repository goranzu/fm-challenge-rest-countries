import { useContext, useRef, useState } from "react";
import styles from "./dropdown.module.css";
import { ReactComponent as ArrowDownIcon } from "../../assets/icons/arrow-down.svg";
import DropDownList from "./dropdown-list/DropdownList";
import { wait } from "../../utils";
import { SearchContext } from "../../context/searchContext";

type DropdownProps = {
  options: string[];
  label: string;
  id: string;
};

const Dropdown = ({ options, label, id }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<HTMLLIElement>(null);

  const ctx = useContext(SearchContext);

  async function toggleIsOpen() {
    setIsOpen(!isOpen);
    await wait(50);
  }

  async function handleOptionClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const value = e.currentTarget.textContent;
    if (!value) {
      return;
    }

    ctx?.setFilterBy(value);
    await wait(100);
    toggleIsOpen();
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <>
      <div onKeyUp={handleKeyUp} className={styles.wrapper}>
        <button
          aria-haspopup="true"
          aria-controls={id}
          onClick={async () => {
            toggleIsOpen();
            if (!isOpen) {
              await wait(1);
              listRef.current?.querySelector("button")?.focus();
            }
          }}
          className={styles.header}
        >
          <p>{ctx!.filterBy.length > 0 ? ctx?.filterBy : label}</p>
          <ArrowDownIcon />
        </button>
        {isOpen && (
          <DropDownList
            handleOptionClick={handleOptionClick}
            options={options}
            close={toggleIsOpen}
            id={id}
            listRef={listRef}
          />
        )}
      </div>
    </>
  );
};

export default Dropdown;
