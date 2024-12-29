"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
const dom_1 = require("@testing-library/dom");
global.fetch = jest.fn();
describe('generateAdvice', () => {
    let button;
    let adviceText;
    let adviceId;
    beforeEach(() => {
        document.body.innerHTML = `
            <button id="advice-button">Get Advice</button>
            <p id="advice-text"></p>
            <span id="advice-id"></span>
        `;
        button = document.getElementById('advice-button');
        adviceText = document.getElementById('advice-text');
        adviceId = document.getElementById('advice-id');
        function generateAdvice() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`https://api.adviceslip.com/advice`);
                    if (!response.ok)
                        throw new Error('Error fetching advice');
                    const { slip } = yield response.json();
                    adviceId.textContent = slip.id;
                    adviceText.textContent = `"${slip.advice}"`;
                }
                catch (error) {
                    adviceId.textContent = 'Id not found';
                    adviceText.textContent = 'Advice not found';
                }
            });
        }
        button.addEventListener('click', generateAdvice);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render advice and id when fetched', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
                slip: { id: '123', advice: 'Always test your code!' },
            }),
        });
        dom_1.fireEvent.click(button);
        yield dom_1.screen.findByText('"Always test your code!"');
        expect(adviceId).toHaveTextContent('123');
        expect(adviceText).toHaveTextContent('"Always test your code!"');
    }));
    it('should display error message when fetch fails', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch.mockRejectedValueOnce(new Error('Fetch failed'));
        dom_1.fireEvent.click(button);
        yield dom_1.screen.findByText('Advice not found');
        expect(adviceId).toHaveTextContent('Id not found');
        expect(adviceText).toHaveTextContent('Advice not found');
    }));
});
