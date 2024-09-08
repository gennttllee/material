import React from 'react';
import { createRoot } from 'react-dom/client';
import { Gantt } from '../index';
import { TaskStatus } from 'components/projects/management/types';

describe('gantt', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
      <Gantt
        tasks={[
          {
            start: new Date(2020, 0, 1),
            end: new Date(2020, 2, 2),
            name: 'Redesign website',
            id: 'Task 0',
            status: TaskStatus.awaitingApproval,
            progress: 45,
            type: 'task'
          }
        ]}
      />
    );
  });
});
