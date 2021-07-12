// Create Modal For Edit Configs
var modalContent = document.createElement('modalEditQuickReplies')
var modal = `<style>.modal {display: none; /* Hidden by default /position: fixed; / Stay in place /z-index: 1; / Sit on top /left: 0;top: 0;width: 100%; / Full width /height: 100%; / Full height /overflow: auto; / Enable scroll if needed /background-color: rgb(0,0,0); / Fallback color /background-color: rgba(0,0,0,0.4); / Black w/ opacity /}.modal-content {background-color: #fefefe;margin: 15% auto; / 15% from the top and centered /padding: 20px;border: 1px solid #888;width: 80%; / Could be more or less, depending on screen size */}.close {color: #aaa;float: right;font-size: 28px;font-weight: bold;}.close:hover,.close:focus {color: black;text-decoration: none;cursor: pointer;}</style>

    <!-- The Modal -->
    <div id="myModal" class="modal" style="z-index: 100;">

        <!-- Modal content -->
        <div class="modal-content">
            {{page}}
            <span class="close" onclick="closeModal()">&times;</span>
            <div v-if="page==='create'">

                Adicionar Botão

                <button
                    id="addButton"
                    style="display:inline-block;border-radius:30px;background:#17a2b8!important;padding:5px;padding-right: 8px; padding-left: 8px;color:white;font-size:13px;cursor: pointer;"
                    @click="listButtons()"
                >< Voltar</button>

                <p></p>
                <input type="text" v-model="newButton.icon" placeholder="Título do botão">
                <p></p>
                <textarea type="text" v-model="newButton.message"  placeholder="Texto"></textarea>
                <p></p>
                <button @click="save()" style="display:inline-block;border-radius:30px;background:#22bb33!important;padding:5px;padding-right: 8px; padding-left: 8px;color:white;font-size:13px;cursor: pointer;">Criar</button>

            </div>
            <div v-else>
                <button
                    id="addButton"
                    style="display:inline-block;
                        border-radius:30px;
                        background:#1d6f70;
                        padding:5px;
                        padding-right: 8px;
                        padding-left: 8px;
                        color:white;
                        font-size:13px;
                        cursor: pointer;
                    "
                    @click="showAddForm()"
                >+</button>

                <b class="text-black">
                    Respostas Prontas - {{name}}
                </b>

                <div v-if="buttons.length === 0"></br></br><b>Nenhum botão cadastrado ainda.</b></div>
                <div v-for="(button, i) in buttons" :key="i">
                    <div v-if="editButton === buttons[i]">
                        Modificar
                        <p></p>
                        <input type="text" v-model="updateData.icon" placeholder="Título do botão">
                        <p></p>
                        <textarea type="text" v-model="updateData.message"  placeholder="Texto"></textarea>
                        <p></p>
                        <button style="background:red;color:black;border-radius:20px" @click="update(buttons[i], i)">Salvar alterações</button>
                    </div>
                    <div v-else>
                        {{buttons[i].icon}} - {{buttons[i].message}} <button style="color:blue" @click="modify(buttons[i], i)">Modificar</button>
                    <div>
                </div>
            </div>

        </div>

    </div>`

if(document.getElementById('myModal')) { document.getElementById('myModal').remove() }
modalContent.innerHTML = modal
document.getElementsByClassName('web')[0].appendChild(modalContent)

const initVuej = () => {
new window.Vue({
    el: '#myModal',
    data: {
        buttons: JSON.parse(localStorage.getItem('buttons')),
        name: "Apollo Gás",
        page: "list",
        newButton: {icon:'', message:''},
        editButton: {},
        updateData: {},
        editButtonIndex: null
    },
    created () {
        console.warn('ok');
    },
    methods: {
        pimba () {
            console.warn('pimba');
            this.$set(this.ex, 2, {id:'4', name:"fedora 3"})
        },
        showAddForm () {
            this.page = 'create'
        },
        listButtons () {
            this.page = 'list'
        },
        save () {
            const {icon, message} = this.newButton
            let buttons = []
            try {
                let buttonsTemp = JSON.parse(localStorage.getItem('buttons'))
                console.warn({buttonsTemp}, typeof(buttonsTemp));
                if(typeof(buttonsTemp) === 'object') { buttons = buttonsTemp }
            }catch(e) {
                console.warn('error to get butttons', e.message);
            }

            console.warn('NEW BUTTON', icon, message, this.newButton);
            buttons.push({icon:icon.replace('\n', '\\n'), message: message.replace('\n', '\\n')})
            localStorage.setItem('buttons', JSON.stringify(buttons))
            this.buttons = buttons
            setTimeout(()=>{
                console.warn('generate');
                window.generateButtonsBar()
            }, 200)
        },
        modify(button, index) {
            console.warn('modify', button, index);
            console.warn(button);
            this.editButtonIndex = index
            this.editButton = button
            this.updateData = button
        },
        update () {
            console.warn('updateData', this.updateData);
            let buttons = JSON.parse(localStorage.getItem('buttons'))
            buttons[this.editButtonIndex] = this.updateData
            console.warn(buttons);
            localStorage.setItem('buttons', JSON.stringify(buttons))
            setTimeout(()=>{
                console.warn('generate');
                window.generateButtonsBar()
            }, 200)
        }
    }
})
}

// Fill buttons using localStore buttons variable

var addBtn = `<button
                        id="addButton"
                        style="display:inline-block;
                            float:right;
                            border-radius:30px;
                            background:#1d6f70;
                            padding:5px;
                            padding-right: 8px;
                            padding-left: 8px;
                            color:white;
                            font-size:13px;
                            cursor: pointer;
                            margin-right:10px;margin-bottom:5px;
                        "
                        onclick="openModal()"
                    >+</button>`


function sendMessage(text) {
    console.warn('sendMessage')
    try {
        const getElementByXpath = (path) => { return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}

        const input = getElementByXpath(`//*[@id="main"]/footer/div[1]/div[2]/div/div[1]/div/div[2]`);

        input.innerHTML = text;
        input.dispatchEvent(new Event('input', {bubbles: true}));

        getElementByXpath(`//*[@id="main"]/footer/div[1]/div[2]/div/div[2]/button`).click();
    }catch(e) {
        console.warn('sendMessage Error', e.message)
    }
}

window.generateButtonsBar = () => {
    try {
        var content = ""
        var buttonsData = JSON.parse(localStorage.getItem('buttons'))
        if(!buttonsData) buttonsData = []
        console.warn('generate bar', {buttonsData});
        for(var i in buttonsData) {
        const {icon, message} = buttonsData[i]
            content += `
            <button tabindex="-1" id="opt--${i}"
                style="font-size: 20px;
                color: #dad4d4;
                background: #912dec;
                border-radius: 10px;
                padding: 3px;font-size: 13px;" class="" aria-label="Open emojis panel" data-tab="5"
            >
                ${icon}
            </button>
            `
        }

        const contentElement = document.createElement('suggar');

        contentElement.innerHTML = `<div id="buttonsPanel" style="margin-left:10px">${content}${addBtn}</div>`

        if(document.getElementsByTagName('suggar').length === 0) {
            document.querySelector("#main > footer").appendChild(contentElement)
        } else {
            document.getElementById('buttonsPanel').innerHTML = `${content}${addBtn}`
        }

        console.warn('init listener opt--1')
        for(var i in buttonsData) {
            const { message } = buttonsData[i]
            var link = document.getElementById(`opt--${i}`);
            link.addEventListener('click', function() {
                console.warn('send', message)
                sendMessage(message)
            });
        }
        
        
    }catch(e) {
        console.warn('error', e.message)
    }

}

window.openModal = () => {
    document.getElementById("myModal").style.display = "block"
}

window.closeModal = () => {
    document.getElementById("myModal").style.display = "none"
}

const interval = setInterval(()=>{
        try {
            const lateralBarElement = document.body.getElementsByClassName('_3Bc7H _20c87')[0]
            lateralBarElement.onclick = () => { window.generateButtonsBar() }
            console.warn('Set onclick event ok')
            clearInterval(interval)
            console.warn('clear interval')
        }catch(e){
            console.warn(e.message)
}},500)