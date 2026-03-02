import { CollisionEndEvent, CollisionStartEvent } from "excalibur";
import { CardAnchor } from "./card-anchor";
import { FlippableActor } from "./flippable-actor";

export class StackManager {
  private anchors: CardAnchor[] = []
  private cards: FlippableActor[] = []

  private startingStack: CardAnchor | undefined
  private startingCard: FlippableActor | undefined
  private collidedStacks: CardAnchor[] = []
  private temporaryStack: CardAnchor

  constructor(temporaryStack: CardAnchor) {
    this.temporaryStack = temporaryStack
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
    this.temporaryStack.off('collisionend')
    this.temporaryStack.off('collisionstart')
    this.anchors = []
    this.cards = []
  }

  private onStackDown = (stack: CardAnchor) => {
    if (this.startingStack) {
      return
    }

    this.startingStack = stack
  }

  private onCardDown = (card: FlippableActor) => {
    if (this.startingCard) {
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

    this.startingCard = undefined
    this.startingStack = undefined
    this.collidedStacks = []
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