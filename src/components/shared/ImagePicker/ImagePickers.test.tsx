import { render,fireEvent } from  '@testing-library/react';
import ImagePicker, { Props } from './ImagePicker';
 
interface NewInput extends HTMLInputElement {
    value: any
}


describe('++++++ Image Picker +++++++',() => {
    const label = 'label';
    let ImageInput: NewInput | null;
    const onChange = jest.fn();
    const placeholder = 'placeholder';

    beforeEach(() => {
        const { queryByPlaceholderText } = render(<ImagePicker onChange={onChange} label={label} placeholder={placeholder} />)
        ImageInput = queryByPlaceholderText(placeholder) as NewInput
    })

    it('should render render the input element',() => {
        expect(ImageInput).toBeFalsy() 
    })

    it('should render render the input element',() => {

        if(ImageInput){
            fireEvent.change(
                ImageInput,
                {
                    target: {
                        value: 'data://'
                    }
                }
            )

            expect(ImageInput.value).toBe('data://')
            expect(ImageInput.value).not.toBe('https://')
        }
        
    })

})