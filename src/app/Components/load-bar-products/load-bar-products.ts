import { Component, ChangeDetectorRef, signal } from '@angular/core';
import { PickListModule, PickListMoveToTargetEvent } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { CategoryTypeService } from '../../services/categorytype/category-type-service';
import { ItemFlattened } from '../../model/ItemFlattened';
import { Tree, TreeNodeDropEvent } from 'primeng/tree';
import { TreeDragDropService, TreeNode, } from 'primeng/api';
import { DragDropModule, Draggable, Droppable } from 'primeng/dragdrop';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { PickTable } from "../Base/pick-table/pick-table";
import { ProductListComponent } from "../product-list/product-list.component";
import { CategoryType } from '@barassistantshared/entities';



@Component({
  selector: 'app-load-bar-products',
  imports: [PickListModule, CommonModule, Tree, DragDropModule, Draggable,
    PickListModule, TreeTableModule, ButtonModule, ProductListComponent],
  providers: [CategoryTypeService, TreeDragDropService],
  templateUrl: './load-bar-products.html',
  styleUrl: './load-bar-products.css'
})
export class LoadBarProducts {
  targetData($event: TreeNode<CategoryType>[]) {
    console.log('targetData received:');
    console.log($event);
  }
  selectedNode: TreeNode<CategoryType> = {} as TreeNode<CategoryType>;
  categoriesType: CategoryType[] = [];
  targetCategories: CategoryType[] = [];
  categoriesTypeFlattened = signal<ItemFlattened[]>([]);
  targetCategoriesFlattened = signal<ItemFlattened[]>([]);
  value1 = signal<TreeNode<CategoryType>[]>([]);
  value2 = signal<TreeNode<CategoryType>[]>([]);
  constructor(private categoriesTypeService: CategoryTypeService,
    private cdr: ChangeDetectorRef) {
    this.categoriesType = this.categoriesTypeService.getData();

    const val1 = this.categoriesTypeService.transformRecursivelyToListTreeNode(this.categoriesTypeService.getData());
    this.value1.set(val1);
    this.categoriesTypeFlattened.set(this.categoriesTypeService.flattenTreetable(val1));
    this.targetCategoriesFlattened.set([]);
    console.log('CategoriesTypeFlattened:');
    console.log(this.categoriesTypeFlattened());

    //this.value2.set([]);
    this.cdr.markForCheck();
    console.log('LoadBarProducts initialized');
    console.log(this.value1());
  }
  moveToRigth($event: Event) {
    if (!this.selectedNode || !this.selectedNode.leaf) {
      console.warn('Selecció invàlida: Selecciona una fulla per transferir.');
      return;
    }
    console.log('moveToRigth:');
    console.log($event);
    // --- A. ACTUALITZACIÓ DEL DESTÍ (value2) ---
    this.value2.update(currentValue => {
      // Crear un nou array amb el node afegit (important per al Signal)
      // Cal fer una còpia del node per trencar les referències, especialment el 'parent'
      const newNode = { ...this.selectedNode };
      return [...currentValue, this.selectedNode];
    });
    console.log('Després d\'afegir a value2:');
    console.log(this.value2());
  }
  manejarSeleccioNode($event: any) {
    this.selectedNode = $event.node;
    console.log('manejarSeleccioNode:');
    console.log($event);
  }
  manejarTransferenciaADreta($event: PickListMoveToTargetEvent) {
    console.log('manejarTransferenciaADreta:');
    console.log($event);
  }
  // Al teu component.ts

  // Utilitza la interfície nativa de PrimeNG per a la transferència si la pots importar,
  // o el tipus genèric si falla
  validateTransfer(event: any) {
    console.log('Validant transferència:');
    console.log(event);
    const itemsToTransfer = event.items;
    let validTransfer = true;

    // 1. Comprova si hi ha algun node pare a l'array d'items a transferir
    for (const item of itemsToTransfer) {
      if (!item.isLeaf) {
        console.error(`ERROR: Intent de transferir node pare "${item.label}"`);
        validTransfer = false;
        break;
      }
    }

    // 2. Si hi ha nodes pares, has de desfer el canvi manualment
    // (o millor, utilitzar un component que permeti prevenir l'acció abans).

    if (!validTransfer) {
      // Aquest és el punt difícil, ja que onTransfer s'executa DESPRÉS.
      // Si no vols complicar-te amb la gestió de l'estat, el millor és:

      // a) Revertir manualment la llista afectada (SOURCE o TARGET)
      // b) Forçar una recàrrega de les llistes SOURCE i TARGET

      // Com que la gestió de l'estat manual és complexa,
      // **la millor estratègia és confiar en la combinació dels passos 1 i 2:**
      // - El clic simple està bloquejat (Pas 1).
      // - El drag and drop està bloquejat (Pas 2).
      // - El doble clic (que activa la transferència) també hauria d'estar bloquejat pel Pas 1 si s'aplica al template correctament.
    }
  }
  // Opcional: Si el doble clic és una transferència, també s'ha de bloquejar
  preventDblClick(event: any) {
    // Comprova l'element DOM clicat per veure si és un node pare.
    // L'estructura de l'esdeveniment aquí és més difícil d'analitzar sense l'ítem.
    // **És millor usar `onTransfer` per controlar la transferència amb botons.**
  }
  preventParentSelection(event: any, isLeaf: boolean) {
    if (!isLeaf) {
      // Si no és una fulla, impedim que l'esdeveniment es propagui
      // a l'element pare de PrimeNG, que és el que gestiona la selecció.
      event.preventDefault();
      event.stopPropagation();
      console.warn(`Node Pare no seleccionable: Clic bloquejat.`);
    } else {
      // Si és una fulla, permetem la propagació normal
      console.log(`Node Fulla seleccionat.`);
    }
  }
  validateSelection(event: { originalEvent: Event, items: any[] }) {
    console.log('Validant selecció:');
    // L'esdeveniment retorna un array d'items seleccionats/desseleccionats
    const selectedItems = event.items as any[]; // Utilitzem 'any' si la teva interfície de node no està tipada
    console.log('Validant selecció:', selectedItems);
    // Recorre tots els elements seleccionats a l'esdeveniment
    for (const item of selectedItems) {
      if (!item.isLeaf) {
        // 1. Opcional: Mostra un missatge a l'usuari (Amb PrimeNG MessageService, per exemple)
        console.warn(`El node pare "${item.label}" no es pot seleccionar.`);

        // 2. Tota la lògica de selecció/transferència de PrimeNG es fa abans d'onSelect.
        // Aquí, la selecció ja s'ha produït. Has de desfer l'acció manualment.

        // La manera més senzilla de desfer la selecció visualment és:
        // a) Si és l'origen: Moure l'element de targetCategoriesFlattened a categoriesTypeFlattened
        // b) Si és el destí: Moure l'element de categoriesTypeFlattened a targetCategoriesFlattened

        // Aquesta deselecció manual és complexa i pot portar a problemes d'estat.

        // **MÈTODE ALTERNATIU MÉS FIABLE (Veure Pas 2.B) **
        // El mètode més net és prevenir la selecció amb un CSS i una funció al click,
        // però si es fa servir el botó de transferència, això no funcionarà.

        // Com que la p-picklist permet fer doble clic o utilitzar els botons per a la transferència,
        // la millor solució és deshabilitar la classe de selecció (Pas 2) i controlar la transferència (Pas 3).
      }
    }
  }
  onNodeDropHandler($event: TreeNodeDropEvent) {
    console.log('Node dropped', $event);
  }
  onDragStart($event: DragEvent) {
    console.log('Drag started', $event);
  }
  // ====================================================================
  // FUNCIÓ PRINCIPAL AMB LA LÒGICA DE RESTRICCIÓ
  // ====================================================================
  manejarDropRestringit(event: any, sourceTree: 'first' | 'second') {
    //node que s'arrossega
    const dragNode: TreeNode<CategoryType> = event.dragNode as TreeNode<CategoryType>;
    //node sobre el qual es fa drop
    const dropNode: TreeNode<CategoryType> = event.dropNode as TreeNode<CategoryType>;
    const dropIndex: number = event.dropIndex;
    const accept: boolean = event.accept; // True per a PrimeNG si els scopes coincideixen
    console.log("Manejant drop restringit...");
    if (dragNode.leaf) {
      console.log("El node arrossegat és una fulla.");

    } else {
      console.log("El node arrossegat NO és una fulla.");
      return;
    }
    console.log("dragNode");
    if (dragNode) {
      console.log(dragNode);
      console.log("Parent del dragNode:");
      console.log(dragNode.parent);

    }
    if (dropNode) {
      console.log("dropNode");
      console.log(dropNode);
    }
    // Si no hi ha acceptació de PrimeNG o no hi ha node arrossegat, sortir
    if (!dragNode) {
      console.log("Drop no acceptat o dragNode no vàlid. Sortint.");
      return;
    }

    // 1. Identificar l'Arbre Origen i Destinació
    const sourceData: TreeNode<CategoryType>[] = sourceTree === 'first' ? this.value1() : this.value2();
    const targetData: TreeNode<CategoryType>[] = sourceTree === 'first' ? this.value2() : this.value1();

    // 2. Determinar la lògica de reubicació només quan s'arrossega entre arbres
    if (dropNode) {
      // Drop s'ha fet sobre un node existent
      console.log("DROP SOBRE NODE:", dropNode.label);
    } else if (dropIndex !== undefined) {
      // Drop s'ha fet a nivell d'arrel
      console.log("DROP A NIVELL D'ARREL, posició:", dropIndex);
    } else {
      // Drop al lloc de 'Drag Nodes Here' (buit)
      console.log("DROP A NIVELL D'ARREL, matriu buida");
    }


    // 3. RECUPERAR EL PARE ORIGINAL (això depèn de com hagueu definit els vostres nodes)
    // En el vostre cas, el parentNode de PrimeNG podria no estar disponible si el node ja s'ha arrossegat.
    // L'única manera fiable seria guardar la propietat 'parent' manualment,
    // o assumir que el node a arrossegar és el que té 'dragNode'.

    // Aquí farem una ASSUMPCIÓ: el node dragNode ja té la informació del pare
    const originalParentLabel = dragNode.parent ? dragNode.parent.label : null;

    // Només apliquem la restricció si hi ha un pare original
    if (originalParentLabel) {
      console.log(`Node original del Pare: ${originalParentLabel}`);

      // Intentar trobar el Pare Original a l'Arbre Destinació (targetData)
      const existingParentInTarget = this.findNodeByLabel(targetData, originalParentLabel);

      if (existingParentInTarget) {
        console.log(`Pare trobat a l'arbre destinació: ${existingParentInTarget.label}. RESTRINGINT DROP.`);

        // A. Assegurar que el pare tingui un array de fills
        if (!existingParentInTarget.children) {
          existingParentInTarget.children = [];
        }

        // B. Moure el node a la nova posició dins del pare trobat
        // (La lògica PrimeNG ja hauria mogut el node de l'origen, ara cal inserir-lo al destí)

        // 1. Clonar el node per evitar problemes de referència de PrimeNG
        const newNode = { ...dragNode };
        delete newNode.parent; // Eliminar la referència del pare antic

        // 2. Eliminar el node de l'arbre origen (si PrimeNG no ho ha fet correctament)
        // Aquesta part pot ser complexa, ja que PrimeNG ja gestiona la retirada.
        // Assumim que la lògica de PrimeNG (utilitzant onNodeDrop) es farà en un segon pas.

        // 3. Afegir el node al nou pare
        existingParentInTarget.children.push(newNode);

        // 4. Actualitzar els arbres per forçar la vista (ja que no estem utilitzant el dropNode directament)
        this.value1.set([...this.value1()]);
        this.value2.set([...this.value2()]);

        // Cancel·lar l'acció de drop normal (depenent de com PrimeNG la gestioni)
        // Com que PrimeNG no permet cancel·lar fàcilment l'acció de drop,
        // la millor solució és desfer el drop i fer l'addició manual.

        // Per simplicitat en aquest exemple, ens centrarem només en l'addició al pare correcte
        // i dependrem de PrimeNG per haver eliminat correctament de l'origen.

        console.warn("L'element s'ha afegit manualment al pare correcte a l'arbre destinació.");
        return; // Sortir per evitar la lògica de drop per defecte (si fos possible)
      }

      console.log("Pare original NO trobat a l'arbre destinació. S'aplicarà la lògica de drop per defecte.");
    }

    // Si no hi ha restricció de pare, o si el pare no existeix, permetre drop normal (o manejar-lo aquí)
    console.log("Drop lliure permès.");
  }
  // La lògica de moviment entre arbres s'ha de fer manualment aquí si PrimeNG
  // no ho fa automàticament sense un 'dropNode'.

  // Nota: Com que estem interceptant el drop, la transferència real
  // (eliminació de l'origen i addició al destí) s'ha de fer aquí.

  // Mètode recursiu per trobar un node per 'label'
  findNodeByLabel(nodes: TreeNode[], label: string): TreeNode | undefined {
    for (const node of nodes) {
      if (node.label === label) {
        return node;
      }
      if (node.children) {
        const found = this.findNodeByLabel(node.children, label);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }


  // Funció auxiliar per canviar el node de l'arbre origen a l'arbre destinació
  // Aquesta funció hauria d'estar separada del maneig de PrimeNG, però l'incloc per fer l'exemple runnable.
  transferirNode(dragNode: TreeNode, targetData: TreeNode[], parentNode: TreeNode | undefined) {
    // (En un cas real, caldria eliminar el node de l'arbre origen aquí)

    const newNode = { ...dragNode };
    delete newNode.parent; // Important per evitar referències creuades

    if (parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push(newNode);
    } else {
      // Si no hi ha pare a l'arbre destí, afegir-lo a l'arrel (o crear el pare)
      targetData.push(newNode);
    }

    this.value1.set([...this.value1()]);
    this.value2.set([...this.value2()]);

  }

}
