import { fireEvent, render } from '@testing-library/react';
import Button from './Button';

const BtnText = 'Submit';

describe('====== Button Test =======', () => {
  it('should not render the button correctly', () => {
    const { queryByTestId } = render(<Button text="" />);

    expect(queryByTestId(BtnText)).toBeFalsy();
  });

  it('should render the button text correctly', () => {
    const { queryByText } = render(<Button text={BtnText} />);

    expect(queryByText(BtnText)).toBeTruthy();
  });

  it('should render button click event', () => {
    const onClick = jest.fn();
    const { queryByTestId } = render(<Button text={BtnText} onClick={onClick} />);
    const btn = queryByTestId('btn');

    if (btn !== null) {
      fireEvent.click(btn);
      expect(onClick).toHaveBeenCalled();
    }
  });
});
