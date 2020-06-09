import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { animateScroll as scroll } from "react-scroll";
import { motion } from "framer-motion";

const Timeline = () => {
  const [leftTimeline, setLeft] = useState([
    {
      id: uuidv4(),
      text:
        "Vous pouvez modifier ce texte ou bien supprimer cette carte. Vous pouvez la glisser pour la déposer une des deux colonnes.",
      card: true,
    },
    { id: uuidv4(), text: "", card: false },
    { id: uuidv4(), text: "", card: false },
    { id: uuidv4(), text: "", card: false },
  ]);
  const [rightTimeline, setRight] = useState([
    {
      id: uuidv4(),
      text:
        "Vous pouvez ajouter un nouvel emplacement ou bien bien cliquer sur creation mode pour voir le résultat.",
      card: true,
    },
    { id: uuidv4(), text: "", card: false },
    { id: uuidv4(), text: "", card: false },
    { id: uuidv4(), text: "", card: false },
  ]);

  const [middleColumn, setMiddle] = useState([
    { id: uuidv4(), text: "1982" },
    { id: uuidv4(), text: "1983" },
    { id: uuidv4(), text: "1984" },
    { id: uuidv4(), text: "1985" },
  ]);

  const [hidden, setHidden] = useState(true);

  const checkSize = (leftLength, RightLength) => {
    const copyMiddleColumn = [...middleColumn];

    if (
      RightLength < copyMiddleColumn.length &&
      leftLength < copyMiddleColumn.length
    ) {
      let lengthDeletion = 0;
      if (RightLength > leftLength) {
        lengthDeletion = RightLength;
      } else {
        lengthDeletion = leftLength;
      }

      copyMiddleColumn.length = lengthDeletion;
      setMiddle(() => [...copyMiddleColumn]);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const copyLeft = [...leftTimeline];
    const copyRight = [...rightTimeline];

    if (destination.droppableId === "REMOVE") {
      if (source.droppableId === "left") {
        copyLeft.splice(source.index, 1);
        checkSize(copyLeft.length, copyRight.length);
        setLeft(() => [...copyLeft]);
      } else {
        copyRight.splice(source.index, 1);
        checkSize(copyLeft.length, copyRight.length);
        setRight(() => [...copyRight]);
      }
    } else {
      if (source.droppableId === destination.droppableId) {
        if (source.droppableId === "right") {
          const copyRight = [...rightTimeline];
          const [removed] = copyRight.splice(source.index, 1);
          copyRight.splice(destination.index, 0, removed);
          checkSize(copyLeft.length, copyRight.length);
          setRight(() => [...copyRight]);
        } else {
          const copyLeft = [...leftTimeline];
          const [removed] = copyLeft.splice(source.index, 1);
          copyLeft.splice(destination.index, 0, removed);
          checkSize(copyLeft.length, copyRight.length);
          setLeft(() => [...copyLeft]);
        }
      } else {
        if (destination.droppableId === "right") {
          const [removeSource] = copyLeft.splice(source.index, 1);
          copyRight.splice(destination.index, 0, removeSource);
          checkSize(copyLeft.length, copyRight.length);
          setRight(() => [...copyRight]);
          setLeft(() => [...copyLeft]);
        } else if (destination.droppableId === "left") {
          const [removeSource] = copyRight.splice(source.index, 1);
          copyLeft.splice(destination.index, 0, removeSource);
          checkSize(copyLeft.length, copyRight.length);
          setRight(() => [...copyRight]);
          setLeft(() => [...copyLeft]);
        }
      }
    }
  };

  const switchCard = (side, index) => {
    const copyLeft = [...leftTimeline];
    const copyRight = [...rightTimeline];
    if (side === "right") {
      copyRight[index].card = !copyRight[index].card;
      copyRight[index].text = "";
      setRight(() => [...copyRight]);
    } else {
      copyLeft[index].card = !copyLeft[index].card;
      copyLeft[index].text = "";
      setLeft(() => [...copyLeft]);
    }
  };

  const updateCard = (e, side, index) => {
    const value = e.target.value;
    const copyLeft = [...leftTimeline];
    const copyRight = [...rightTimeline];
    if (side === "right") {
      copyRight[index].text = value;
      setRight(() => [...copyRight]);
    } else {
      copyLeft[index].text = value;
      setLeft(() => [...copyLeft]);
    }
  };

  const NewCard = () => {
    const AddCard = () => {
      const copyLeft = [...leftTimeline];
      const copyRight = [...rightTimeline];

      if (
        copyLeft.length < copyRight.length ||
        copyLeft.length === copyRight.length
      ) {
        copyLeft.push({ id: uuidv4(), text: "", card: false });
        setLeft(() => [...copyLeft]);
      } else {
        copyRight.push({ id: uuidv4(), text: "", card: false });
        setRight(() => [...copyRight]);
      }
      scroll.scrollToBottom();
    };

    return (
      <div
        className={hidden ? "addCard" : "addCard addCard--disabled"}
        onClick={hidden ? AddCard : ""}
      >
        Add a new card
        <img className="iconHand" src="./click.svg" alt="click"></img>
      </div>
    );
  };

  const SwitchMode = () => {
    const switchCreation = () => {
      setHidden(() => !hidden);
    };
    return (
      <div
        onClick={switchCreation}
        className={
          hidden ? "creationMode" : "creationMode creationMode--disabled"
        }
      >
        Creation mode
        <img className="iconHand" src="./click.svg" alt="click"></img>
        {hidden ? "On" : "Off"}
      </div>
    );
  };

  const AddTimeCard = () => {
    const Add = () => {
      const copyMiddleColumn = [...middleColumn];
      copyMiddleColumn.push({ id: uuidv4(), text: "" });
      setMiddle(() => [...copyMiddleColumn]);
    };

    return (
      <div
        onClick={
          (hidden && middleColumn.length !== leftTimeline.length) ||
          middleColumn.length !== rightTimeline.length
            ? Add
            : ""
        }
        className={
          (hidden && middleColumn.length !== leftTimeline.length) ||
          middleColumn.length !== rightTimeline.length
            ? "AddTimeCard"
            : "AddTimeCard AddTimeCard--disabled"
        }
      >
        Add time card
        <img className="iconHand" src="./click.svg" alt="click"></img>
      </div>
    );
  };

  const updateMiddleCard = (e, index) => {
    e.preventDefault();
    const copyMiddleColumn = [...middleColumn];
    const value = e.target.value;
    copyMiddleColumn[index].text = value;
    setMiddle(() => [...copyMiddleColumn]);
  };

  return (
    <div>
      <NewCard />
      <SwitchMode />
      <AddTimeCard />
      <div className="middleColumn">
        {middleColumn.map((row, index) => (
          <div key={index}>
            <textarea
              value={row.text}
              onChange={(e) => updateMiddleCard(e, index)}
            ></textarea>
          </div>
        ))}
      </div>
      {hidden ? (
        <div className="container-timeline">
          <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            <Droppable droppableId={"left"}>
              {(provided, snapshot) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="container-timeline--col container-timeline--left "
                  >
                    {leftTimeline.map((props, index) => {
                      return (
                        <Draggable
                          key={props.id}
                          draggableId={props.id}
                          index={index}
                        >
                          {(provided, snapshot) => {
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <motion.div
                                  animate={{ opacity: [0, 1] }}
                                  transition={{
                                    duration: 1,
                                  }}
                                  className=" container-item container-item--left"
                                  id={`left-${index}`}
                                >
                                  {props.card ? (
                                    <div
                                      name={`left-${index}`}
                                      className="container-item__text--left"
                                    >
                                      <div
                                        onClick={() =>
                                          switchCard("left", index)
                                        }
                                        className="iconDelete"
                                      >
                                        <img
                                          src="./delete.svg"
                                          alt="plus"
                                        ></img>
                                      </div>
                                      <textarea
                                        value={props.text}
                                        className="textareaCard"
                                        onChange={(e) =>
                                          updateCard(e, "left", index)
                                        }
                                      ></textarea>
                                    </div>
                                  ) : (
                                    <div
                                      className="empty-container"
                                      onClick={() => switchCard("left", index)}
                                    >
                                      <div className="empty-container__icon">
                                        <img src="./plus.svg" alt="plus"></img>
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
            <Droppable droppableId={"right"}>
              {(provided, snapshot) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="container-timeline--col container-timeline--right "
                  >
                    {rightTimeline.map((props, index) => {
                      return (
                        <Draggable
                          key={props.id}
                          draggableId={props.id}
                          index={index}
                        >
                          {(provided, snapshot) => {
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <motion.div
                                  animate={{ opacity: [0, 1] }}
                                  transition={{
                                    duration: 1,
                                  }}
                                  className="container-item container-item--right"
                                >
                                  {props.card ? (
                                    <div className="container-item__text--right">
                                      <div
                                        onClick={() =>
                                          switchCard("right", index)
                                        }
                                        className="iconDelete"
                                      >
                                        <img
                                          src="./delete.svg"
                                          alt="plus"
                                        ></img>
                                      </div>
                                      <textarea
                                        value={props.text}
                                        className="textareaCard"
                                        onChange={(e) =>
                                          updateCard(e, "right", index)
                                        }
                                      ></textarea>
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => switchCard("right", index)}
                                      className="empty-container"
                                    >
                                      <div className="empty-container__icon">
                                        <img src="./plus.svg" alt="plus"></img>
                                      </div>
                                    </div>
                                  )}
                                  <span className="circle"></span>
                                </motion.div>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
            <Droppable droppableId={"REMOVE"}>
              {(provided, snapshot) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="removeCard"
                  >
                    <div className="deleteCardIcon">
                      <img src="./deleteWhite.svg" alt="trash"></img>
                    </div>
                    <p>DROP</p>
                    <p>HERE</p>
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </div>
      ) : (
        <div className="container-timeline">
          <div className="container-timeline--col container-timeline--left ">
            {leftTimeline.map((props, index) => {
              return (
                <div className=" container-item container-item--left">
                  {props.card ? (
                    <div className="container-item__text--left">
                      {props.text}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="container-timeline--col container-timeline--right">
            {rightTimeline.map((props, index) => {
              return (
                <div className=" container-item container-item--right">
                  {props.card ? (
                    <div className="container-item__text--right">
                      {props.text}
                    </div>
                  ) : (
                    <div className="invisibleContainer"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
