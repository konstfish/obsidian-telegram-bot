import { ApplicationContext } from './appcontext';

export class FileController {
    context: ApplicationContext

    constructor(context: ApplicationContext){
        this.context = context
    }

    appendToNote(message: string){
		var temp = this.context.settings.noteAppendTemplate;

		temp = temp.replace('{message}', message);

        this.context.app.vault.adapter.append(this.context.settings.noteAppendPath, temp)
	}

    //createNewNote(message: string){
    //
	//	if(this.context.app.vault.adapter.exists()))
	//	// this.app.vault.adapter.write()
    //}
}