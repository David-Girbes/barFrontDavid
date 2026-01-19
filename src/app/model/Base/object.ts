export class Object {

}
export class Entity extends Object {
  id: number;
  constructor() {
    super();
    this.id = 0;
  }
  equal(entity: Entity) {
    return entity.id === this.id;
  }
}
