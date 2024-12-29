import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/dom';

global.fetch = jest.fn();

describe('generateAdvice', () => {
    let button: HTMLButtonElement;
    let adviceText: HTMLParagraphElement;
    let adviceId: HTMLSpanElement;

    beforeEach(() => {
        document.body.innerHTML = `
            <button id="advice-button">Get Advice</button>
            <p id="advice-text"></p>
            <span id="advice-id"></span>
        `;

        button = document.getElementById('advice-button') as HTMLButtonElement;
        adviceText = document.getElementById('advice-text') as HTMLParagraphElement;
        adviceId = document.getElementById('advice-id') as HTMLSpanElement;

        async function generateAdvice() {
            try {
                const response = await fetch(`https://api.adviceslip.com/advice`);

                if (!response.ok) throw new Error('Error fetching advice');

                const { slip }: SlipProps = await response.json();

                adviceId.textContent = slip.id;
                adviceText.textContent = `"${slip.advice}"`;
            } catch (error) {
                adviceId.textContent = 'Id not found';
                adviceText.textContent = 'Advice not found';
            }
        }

        button.addEventListener('click', generateAdvice);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render advice and id when fetched', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
                slip: { id: '123', advice: 'Always test your code!' },
            }),
        });

        fireEvent.click(button);

        await screen.findByText('"Always test your code!"');

        expect(adviceId).toHaveTextContent('123');
        expect(adviceText).toHaveTextContent('"Always test your code!"');
    });

    it('should display error message when fetch fails', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

        fireEvent.click(button);

        await screen.findByText('Advice not found');

        expect(adviceId).toHaveTextContent('Id not found');
        expect(adviceText).toHaveTextContent('Advice not found');
    });
});