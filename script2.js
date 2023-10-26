let botao = document.querySelector('#microfone');
    let input = document.querySelector('input');

const OpenAPIiKey = process.env.OPEN_API_KEY;
const AzureAPIKey = process.env.AZURE_API_KEY;


// Aqui vamos capturar a fala do usuário
const CapturarFala = () => {

    let botao = document.querySelector('#microfone');
    let input = document.querySelector('input');

    // Aqui vamos criar um objeto de reconhecimento de fala
    const recognition = new webkitSpeechRecognition();
    recognition.lang = window.navigator.language;
    recognition.interimResults = true;

    botao.addEventListener('mousedown', () => {
        recognition.start();
    });

    botao.addEventListener('mouseup', () => {
        recognition.stop();
        PerguntarAoJarvis(input.value);
    });

    // Aqui vamos capturar o resultado da fala
    recognition.addEventListener('result', (e) => {
        const result = e.results[0][0].transcript;
        input.value = result;
    });

}


const PerguntarAoJarvis = async (pergunta) => {

    let url = 'https://api.openai.com/v1/chat/completions';
    let header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OpenAPIiKey}`
    }

    let body = {
        "model": "ft:gpt-3.5-turbo-0613:zeros-e-um::8DDHyrh4",
        "messages": [
          {
            "role": "system",
            "content": "Jarvis é um chatbot pontual e muito simpático que ajuda as pessoas"
          },
          {
            "role": "user",
            "content": pergunta
          }
        ],
        "temperature": 0.7
    }

    let options = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body)
    }

    fetch(url, options)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        // console.log(data.choices[0].message.content);
        FalarComoJarvis(data.choices[0].message.content);
    });

}


const FalarComoJarvis = (textoParaFala) => {
    const endpoint = 'https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1'

    const requestOptions = {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': AzureAPIKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
            'User-Agent': 'curl',
        },
        body: `<speak version='1.0' xml:lang='pt-BR'>
                <voice xml:lang='pt-BR' xml:gender='Male' name='pt-BR-AntonioNeural'>
                 ${textoParaFala}
                </voice>
            </speak>`,
    };

    fetch(endpoint, requestOptions)
    .then(response => {
        if (response.ok) {
            return response.arrayBuffer();
        } else {
            throw new Error(`Falha na requisição: ${response.status} - ${response.statusText}`);
        }
    })
    .then(data => {
        const blob = new Blob([data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);

        const audioElement = new Audio(audioUrl);
        audioElement.play();
    })
    .catch(error => {
        console.error('Erro:', error);
    });

}


//CapturarFala();



//dark mode
const darkModeButton = document.getElementById('dark-mode-button');

darkModeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});



// teste ouvindo secreto
// Verifique se o navegador suporta a API de reconhecimento de fala
// if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

//     recognition.continuous = true;
//     recognition.lang = 'pt-BR'; // Configurar o idioma desejado

//     recognition.onresult = function(event) {
//         const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
//         console.log('Você disse: ' + transcript);

//         // Verificar se a palavra-chave foi detectada
//         if (transcript.includes('ok')) {
//             console.log('Palavra-chave detectada! Responder...');

//             // Aqui você pode adicionar lógica para responder à palavra-chave
//             //CapturarFala();
//             //PerguntarAoJarvis();
//             //recognition.start();
//             //PerguntarAoJarvis(input.value);
//             //recognition.stop();
//             //PerguntarAoJarvis(input.value);
//         }
//     };

//     recognition.onend = function() {
//         console.log('Parando o reconhecimento de fala.');
//     };

//     recognition.start();
// } else {
//     console.error('Seu navegador não suporta a API de reconhecimento de fala.');
// }

// metodo Brandao
const AtivarJarvis = () => {

    // Crie uma instância de SpeechRecognition
    const recognition = new webkitSpeechRecognition();

    //testes
    const input = document.querySelector('input');

    // Defina configurações para a instância
    recognition.continuous = true; // Permite que ele continue escutando
    recognition.interimResults = false; // Define para true se quiser resultados parciais

    // Inicie o reconhecimento de voz
    recognition.start();

    // Adicione um evento de escuta para lidar com os resultados
    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1]; // Último resultado

        // Verifique o texto reconhecido
        const recognizedText = result[0].transcript;

        // Verifique se a palavra "Jarvis" está no texto
        if (recognizedText.toLowerCase().includes('jarvis')) {

            // Comece a salvar a pergunta quando "Jarvis" é detectado
            let array_pergunta = recognizedText.toLowerCase().split('jarvis');
            array_pergunta = array_pergunta[array_pergunta.length - 1];

            input.value = array_pergunta;
            PerguntarAoJarvis(array_pergunta);

            // Pare o reconhecimento de voz para economizar recursos
            recognition.stop();
        }
    };

    // Adicione um evento para reiniciar o reconhecimento após um tempo
    recognition.onend = () => {
        setTimeout(() => {
            recognition.start();
        }, 1000); // Espere 1 segundo antes de reiniciar
    };


}


AtivarJarvis();