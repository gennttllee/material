import { render, fireEvent } from '@testing-library/react';
import IconInput from './IconInput';

interface NewInput extends HTMLInputElement {
  value: any;
}

const onChange = jest.fn();
const placeholder = 'john doe';
let HtmlInput: NewInput | null;

beforeEach(() => {
  const { queryByPlaceholderText } = render(
    <IconInput placeholder={placeholder} onChange={onChange} />
  );
  HtmlInput = queryByPlaceholderText(placeholder) as NewInput;
});

it('should render the component correctly', () => {
  // expetec to find a plceholder with the value of john doe
  expect(HtmlInput).toBeTruthy();
});

it('should update onChange correclt', () => {
  //
  if (HtmlInput) {
    // check if the onClick event is working
    fireEvent.change(HtmlInput, {
      target: {
        value: 'chriss'
      }
    });

    expect(HtmlInput.value).toBe('chriss');
    expect(HtmlInput.value).not.toBe('something');
  }
});
