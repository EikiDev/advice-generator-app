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
const button = document.getElementById('advice-button');
const adviceText = document.getElementById('advice-text');
const adviceId = document.getElementById('advice-id');
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
            console.log(error);
            adviceId.textContent = 'Id not found';
            adviceText.textContent = 'Advice not found';
        }
    });
}
button.addEventListener('click', generateAdvice);
generateAdvice();
