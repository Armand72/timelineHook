import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

const Timeline = () => {
  const [timeline, setTimeline] = useState([
    {
      id: uuidv4(),
      item: [
        { id: uuidv4(), text: "essaie", i: 0 },
        { id: uuidv4(), text: "1ere ligne", i: 1 },
      ],
    },
    {
      id: uuidv4(),
      item: [
        { id: uuidv4(), text: "essaie", i: 2 },
        { id: uuidv4(), text: "2ème ligne", i: 3 },
      ],
    },
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    console.log(result);
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
    }
  };

  const onDragUpdate = (result, provided) => {};
  return (
    <div>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result)}
        onDragUpdate={(result, provided) => onDragUpdate(result, provided)}
      >
        <Droppable droppableId={"timeline"}>
          {(provided, snapshot) => {
            return (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="container-timeline"
              >
                {timeline.map((props, index) => {
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
                            className="bigdraggable"
                          >
                            <Droppable
                              droppableId={"innerdroppable"}
                              direction="horizontal"
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="innerdroppable"
                                  >
                                    {timeline[index].item.map(
                                      (props, index) => {
                                        return (
                                          <Draggable
                                            key={props.id + 100}
                                            draggableId={props.id}
                                            index={props.i}
                                          >
                                            {(provided, snapshot) => {
                                              return (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  className="element"
                                                >
                                                  <h1>{props.text}</h1>
                                                </div>
                                              );
                                            }}
                                          </Draggable>
                                        );
                                      }
                                    )}
                                    {provided.placeholder}
                                  </div>
                                );
                              }}
                            </Droppable>
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
      </DragDropContext>
    </div>
  );
};

export default Timeline;
