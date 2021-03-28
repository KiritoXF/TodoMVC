import React, { useEffect, useState } from 'react';
import { Card, Input, Checkbox, Divider, Button } from 'antd';

// 任务类型
interface ToDoType {
  key: number;
  active: boolean;
  title: string;
  isEditing: boolean;
}

const ToDoIndex: React.FC<{}> = () => {

  // 任务列表
  const [todoList, setTodoList] = useState<ToDoType[]>([]);

  // 输入框的值
  const [inputValue, setInputValue] = useState<string>('');

  // 编辑框的值
  const [editingValue, setEditingValue] = useState<string>('');

  // 当前展示的类型
  const [currentShown, setCurrentShown] = useState<string>('all');

  // 初始化
  useEffect(() => {
    setTodoList(JSON.parse(localStorage.getItem('TodoList') || '[]'));
  }, []);

  // 修改本地存储
  const editLocalStorage = (list: ToDoType[]) => {
    localStorage.setItem('TodoList', JSON.stringify(list));
  }

  // 新增任务
  const addToDo = () => {
    if (!inputValue) {
      return;
    }
    const tempList = todoList.concat({ key: new Date().getTime(), active: true, title: inputValue, isEditing: false });
    setTodoList(tempList);
    setInputValue('');
    editLocalStorage(tempList);
  }

  // 清空已完成的任务
  const clearCompleted = () => {
    const tempList = todoList.filter((item: ToDoType) => item.active);
    setTodoList(tempList);
    editLocalStorage(tempList);
  }

  // 获取目标任务
  const getTargetTodo = (key: number) => {
    const index: number = todoList.findIndex((item) => item.key === key);
    const targetTodo = todoList[index];
    return { index, targetTodo };
  }

  // 更改任务状态
  const changeStatus = (key: number) => {
    const { index, targetTodo }: { index: number, targetTodo: ToDoType } = getTargetTodo(key);
    targetTodo.active = !targetTodo.active;
    const tempList = [...todoList];
    tempList[index] = targetTodo;
    setTodoList(tempList);
    editLocalStorage(tempList);
  }

  // 修改编辑中的任务
  const changeEditing = (key: number, editFlag?: boolean) => {
    const { index, targetTodo }: { index: number, targetTodo: ToDoType } = getTargetTodo(key);
    targetTodo.isEditing = !targetTodo.isEditing;
    setEditingValue(targetTodo.title);
    if (editFlag) {
      targetTodo.title = editingValue;
    }
    const tempList = [...todoList];
    tempList[index] = targetTodo;
    setTodoList(tempList);
    editLocalStorage(tempList);
  }

  // 获取当前展示的类别
  const getShownStatus = (active: boolean) => {
    if (currentShown === 'active') {
      return !active;
    }
    if (currentShown === 'completed') {
      return active;
    }
    return false;
  }

  // 删除指定任务
  const removeTodo = (key: number) => {
    const { index }: { index: number } = getTargetTodo(key);
    const tempList = [...todoList];
    tempList.splice(index, 1);
    setTodoList(tempList);
    editLocalStorage(tempList);
  }

  // 获取活动中的任务个数
  const getActiveCount = () => {
    return todoList.filter(item => item.active).length;
  }

  // 全选
  const checkAll = () => {
    const tempList = [...todoList].map((item: ToDoType) => {
      return { ...item, active: getActiveCount() === 0 }
    });
    setTodoList(tempList);
    editLocalStorage(tempList);
  }

  // 获取按钮类型
  const getButtonType = (buttonName: string) => {
    return currentShown === buttonName ? 'primary' : 'default';
  }

  return (
    <>
      <div style={{ margin: '0 30%' }}>
        {/* 标题 todos */}
        <h1 style={{
          textAlign: 'center',
          fontSize: '100px',
          fontWeight: 100,
          textRendering: 'optimizeLegibility',
          color: 'rgba(175, 47, 47, 0.15)'
        }}>todos</h1>
        <Card style={{ width: '100%' }}>
          {/* 全选按钮 */}
          <p style={{ float: 'left' }}>
            <Checkbox onClick={checkAll} style={{ display: todoList.length === 0 ? 'none' : '' }} />
          </p>
          {/* 输入框 */}
          <p style={{ float: 'left', marginLeft: '20px', overflow: 'hidden', width: '90%' }}>
            <Input placeholder="What needs to be done?"
              value={inputValue}
              onPressEnter={addToDo}
              onChange={(e) => setInputValue(e.target.value)} />
          </p>
          <Divider />
          {/* 任务列表 */}
          {todoList?.map((todo: ToDoType) => {
            return <div style={{ display: getShownStatus(todo.active) ? 'none' : '' }}>
              <Checkbox
                checked={!todo.active}
                onChange={() => changeStatus(todo.key)}
                style={{ display: todo.isEditing ? 'none' : '' }} />
              {!todo.isEditing &&
                <span
                  onDoubleClick={() => changeEditing(todo.key)}
                  style={{
                    marginLeft: '20px',
                    wordWrap: 'break-word',
                    textDecorationLine: !todo.active ? 'line-through' : ''
                  }}>{todo.title}</span>
              }
              {todo.isEditing &&
                <Input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => changeEditing(todo.key, true)}
                  onPressEnter={() => changeEditing(todo.key, true)}
                  style={{ marginLeft: '20px' }} />
              }
              <Button
                type="text"
                danger
                onClick={() => removeTodo(todo.key)}
                style={{ float: 'right', display: todo.isEditing ? 'none' : '' }}>X</Button>
              <Divider />
            </div>
          })}
          {/* 底部功能区 */}
          {getActiveCount()} item{getActiveCount() > 1 && 's'} left
          <p style={{ textAlign: 'center' }}>
            <Button onClick={() => setCurrentShown('all')} type={getButtonType('all')}>All</Button>
            <Button onClick={() => setCurrentShown('active')} type={getButtonType('active')}>Active</Button>
            <Button onClick={() => setCurrentShown('completed')} type={getButtonType('completed')}>Completed</Button>
            <Button
              onClick={clearCompleted}
              style={{ display: getActiveCount() === todoList.length ? 'none' : '', float: 'right' }}>
              Clear completed</Button>
          </p>
        </Card>
      </div>
    </>
  );
};

export default ToDoIndex;