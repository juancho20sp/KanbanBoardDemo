import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable  } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

const itemsFromBackend = [
  { id: uuidv4(), content: 'First task' },
  { id: uuidv4(), content: 'Second task' }
];

const columnsFromBackend = {
    [uuidv4()]: {
      name: 'To Do',
      items: itemsFromBackend
    },
    [uuidv4()]: {
      name: 'In Progress',
      items: []
    }
  };

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) {
    return;
  }

  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId];
    const destinyColumn = columns[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
    const destinyItems = [...destinyColumn.items];

    const [removed] = sourceItems.splice(source.index, 1);

    destinyItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destinyColumn,
        items: destinyItems
      }
    })
  } else {
    const column = columns[source.droppableId];

  const copiedItems = [...column.items];

  const [removed] = copiedItems.splice(source.index, 1);

  copiedItems.splice(destination.index, 0, removed);

  setColumns(
    {
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    }
  )
  }

  

}


function App() {
  const [columns, setColumns] = useState(columnsFromBackend);

  return (
    <div style={{display: 'flex', justifyContent: 'center', height: '100%'}}>
      <DragDropContext onDragEnd={res => onDragEnd(res, columns, setColumns)}>
        { Object.entries(columns).map(([id, column]) => {
          console.log(column)
          return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <h2>{column.name}</h2>
            <Droppable droppableId={id} key={id}>
                {/* Snapshot: the thing i'm dragging */}
                {(provided, snapshot) => {
                  return (
                    <div 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                        padding: 4,
                        width: 250,
                        minHeight: 500
                      }}>
                      
                      {
                        column.items.map((item, idx) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={idx}>
                              {(provided, snapshot) => {
                                return (
                                  <div ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: 'none',
                                    padding: 16,
                                    margin: '0 0 8px 0',
                                    minHeight: '50px',
                                    backgroundColor: snapshot.isDragging ? '#263b4a' : '456c86',
                                    color: 'white',
                                    ...provided.draggableProps.style
                                  }}
                                  >
                                    {
                                      item.content
                                    }
                                  </div>
                                )
                              }}
                            </Draggable>
                          )
                        })
                      }

                      {provided.placeholder}
                    </div>
                  )
                }}
            </Droppable>
            </div>
          )
        }) }
      </DragDropContext>
    </div>
  );
}

export default App;
