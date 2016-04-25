import element from "./lib/element";
import {Component, Attribute} from "./lib/decorators";
import {RealTeam} from "./lib/models";

/**
 * @author fireneslo@gmail.com
 * Hello world docs
 **/
@Component('ns')
@Attribute('team', RealTeam)
class Hello {
  constructor(world) {
    this.emit('neat:stuff', {world})
  }
}
