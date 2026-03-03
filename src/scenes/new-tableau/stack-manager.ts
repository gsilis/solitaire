import { CollisionEndEvent, CollisionStartEvent } from "excalibur";
import { CardAnchor } from "./card-anchor";
import { FlippableActor } from "./flippable-actor";

type StackCallback = (stack: CardAnchor) => void

export class StackManager {
  private anchors: CardAnchor[] = []
  private cards: FlippableActor[] = []
  private callback: StackCallback

  private startingStack: CardAnchor | undefined
  private startingCard: FlippableActor | undefined
  private collidedStacks: CardAnchor[] = []
  private temporaryStack: CardAnchor

  constructor(temporaryStack: CardAnchor, callback: StackCallback) {
    this.temporaryStack = temporaryStack
    this.callback = callback
    this.temporaryStack.on('collisionend', this.onTemporaryStackCollisionEnd)
    this.temporaryStack.on('collisionstart', this.onTemporaryStackCollisionStart)
  }

  addStacks(...stacks: CardAnchor[]) {
    stacks.forEach((stack) => {
      stack.on('pointerdown', () => this.onStackDown(stack))
      stack.on('pointerup', this.onMouseUp)
    })
    this.anchors.push(...stacks)
  }

  addCards(...cards: FlippableActor[]) {
    cards.forEach((card) => {
      card.on('pointerdown', () => this.onCardDown(card))
      card.on('pointerup', this.onMouseUp)
    })
    this.cards.push(...cards)
  }

  cleanup() {
    this.anchors.forEach(anchor => {
      anchor.off('pointerdown')
      anchor.off('pointerup')
    })

    this.cards.forEach((card) => {
      card.off('pointerdown')
      card.off('pointerup')
    })

    this.startingCard = undefined
    this.startingStack = undefined
    this.collidedStacks = []
    this.anchors = []
    this.cards = []
  }

  teardown() {
    this.temporaryStack.off('collisionend')
    this.temporaryStack.off('collisionstart')
  }

  private onStackDown = (stack: CardAnchor) => {
    if (this.startingStack || !stack.enabled) {
      return
    }

    this.startingStack = stack

    if (!this.startingCard) {
      return
    }

    const cards = this.startingStack.detach(this.startingCard)

    if (cards) {
      this.temporaryStack.attach(...cards)
    }
  }

  private onCardDown = (card: FlippableActor) => {
    if (this.startingCard || card.back) {
      return
    }

    this.startingCard = card

    if (!this.startingStack) {
      return
    }

    const cards = this.startingStack.detach(card)

    if (cards) {
      this.temporaryStack.attach(...cards)
    }
  }

  private onMouseUp = () => {
    const firstCard = this.temporaryStack.getCardAt(0)
    const rootCard = firstCard?.card

    if (!rootCard) {
      this.startingCard = undefined
      this.startingStack = undefined
      this.collidedStacks = []
      return
    }

    const availableStack = this.collidedStacks.reduce<CardAnchor | null>((acceptableStack, stack) => {
      const stackAcceptable = stack?.accepts(stack, rootCard)
      return acceptableStack || (stackAcceptable && stack) || null
    }, null) || this.startingStack

    const detachedCards = this.temporaryStack.detachAll()

    if (availableStack) {
      availableStack.attach(...detachedCards)
    }

    const oldStackLastCard = this.startingStack?.lastCardGraphic
    if (oldStackLastCard?.back) {
      oldStackLastCard.flip()
    }

    this.startingCard = undefined
    this.startingStack = undefined
    this.collidedStacks = []
    if (availableStack) this.callback(availableStack)
  }

  private onTemporaryStackCollisionStart = (event: CollisionStartEvent) => {
    if (!this.startingStack) {
      // We are not currently interacting...
      return
    }

    const otherAsCardAnchor = event.other.owner as CardAnchor
    
    if (!otherAsCardAnchor?.isRoot) {
      // This is a card, not an anchor
      return
    }

    this.collidedStacks.push(otherAsCardAnchor)
  }

  private onTemporaryStackCollisionEnd = (event: CollisionEndEvent) => {
    if (!this.startingStack) {
      return
    }

    const otherAsCardAnchor = event.other.owner as CardAnchor

    if (!otherAsCardAnchor?.isRoot) {
      // THis is a card, not an anchor
      return
    }

    this.collidedStacks = this.collidedStacks.filter(s => s !== otherAsCardAnchor)
  }
}