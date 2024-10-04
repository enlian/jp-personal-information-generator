import { tokenize, getTokenizer } from "kuromojin";

tokenize("黒文字").then(tokens => {
    console.log(tokens[0].reading);
});
